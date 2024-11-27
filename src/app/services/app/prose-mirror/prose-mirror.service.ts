import { Injectable, OnDestroy } from '@angular/core';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import { Decoration, DecorationSet, EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { addListNodes, liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { dropCursor } from 'prosemirror-dropcursor';
import colors from 'tailwindcss/colors';
import { inputRules, textblockTypeInputRule, wrappingInputRule } from 'prosemirror-inputrules';
import { ToastService } from '../toast/toast.service';

export abstract class NoContentNodeView implements NodeView {
  node: ProseMirrorNode;

  view: EditorView;

  getPos: () => number | undefined;

  dom: HTMLElement;

  actions: HTMLElement;

  document: Document;

  mutationObserver: MutationObserver;

  protected constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.document = this.view.root as Document;

    this.dom = this.document.createElement('div');
    this.dom.classList.add(
      'relative',
      'prosemirror-no-placeholder', // 이미지 노드에서 placeholder 표시하지 않기 위해 추가
    );
    this.dom.contentEditable = 'true';

    this.actions = this.document.createElement('div');
    this.actions.classList.add(
      'flex-center-start',
      'rounded',
      'p-1',
      'bg-gray-700',
      'gap-0.5',
      'absolute',
      'top-full',
      'right-0',
      'translate-y-2',
      'opacity-0',
      'pointer-events-none',
      'transition-all',
      'z-50',
    );

    const addButton = this.document.createElement('button');

    addButton.type = 'button';
    addButton.classList.add(
      'flex-center',
      'size-7',
      'bg-gray-700',
      'hover:brightness-110',
      'active:brightness-125',
      'transition-all',
      'rounded',
    );
    addButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';

    const removeButton = this.document.createElement('button');

    removeButton.type = 'button';
    removeButton.classList.add(
      'flex-center',
      'size-7',
      'bg-gray-700',
      'hover:brightness-110',
      'active:brightness-125',
      'transition-all',
      'rounded',
    );
    removeButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    addButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.addParagraph();
    });

    removeButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.destroy();
    });

    this.actions.append(addButton, removeButton);

    this.dom.append(this.actions);

    this.mutationObserver = new MutationObserver((records) => {
      records.forEach((_record) => {
        if (_record.attributeName === 'class') {
          const target = _record.target as HTMLElement;

          if (target.classList.contains('ProseMirror-selectednode')) {
            this.showActions();
          } else {
            this.hideActions();
          }
        }
      });
    });

    this.mutationObserver.observe(this.dom, {
      attributes: true,
    });
  }

  showActions(): void {
    this.actions.classList.add('opacity-100');
    this.actions.classList.remove('opacity-0', 'pointer-events-none');
  }

  hideActions(): void {
    this.actions.classList.add('opacity-0', 'pointer-events-none');
    this.actions.classList.remove('opacity-100');
  }

  addParagraph(): void {
    const { state, dispatch } = this.view;
    const { tr, schema, selection } = state;
    const { $from } = selection;

    const rootBlockPos = $from.start(1);

    let transaction = tr.insert(rootBlockPos, schema.nodes['paragraph'].create());

    transaction = transaction.setSelection(TextSelection.create(transaction.doc, rootBlockPos + 1));

    dispatch(transaction);
  }

  ignoreMutation(mutation: ViewMutationRecord): boolean {
    return this.actions === mutation.target;
  }

  destroy() {
    this.dom.remove();
  }
}

export class ImageNodeView extends NoContentNodeView {
  image: HTMLImageElement;

  constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number | undefined) {
    super(node, view, getPos);

    this.image = this.document.createElement('img');

    this.image.src = this.node.attrs['src'];
    this.image.alt = this.node.attrs['alt'] || '';
    this.image.title = this.node.attrs['title'] || '';

    this.dom.append(this.image);
  }

  update(node: ProseMirrorNode) {
    if (node.type === this.node.type) {
      this.node = node;
      this.image.src = this.node.attrs['src'];

      return true;
    } else {
      return false;
    }
  }
}

export class YoutubeEmbedNodeView extends NoContentNodeView {
  iframe: HTMLIFrameElement;

  constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number | undefined) {
    super(node, view, getPos);

    this.iframe = this.document.createElement('iframe');

    this.iframe.src = `https://www.youtube.com/embed/${this.node.attrs['videoId']}`;
    this.iframe.style.border = 'none';
    this.iframe.allowFullscreen = true;

    this.dom.append(this.iframe);
  }

  update(node: ProseMirrorNode) {
    if (node.type === this.node.type) {
      this.node = node;
      this.iframe.src = `https://www.youtube.com/embed/${this.node.attrs['videoId']}`;

      return true;
    } else {
      return false;
    }
  }
}

@Injectable()
export class ProseMirrorService implements OnDestroy {
  files: File[] = [];

  /** 커스텀 스키마 */
  private readonly _schema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block')
      .update('image', {
        ...schema.spec.nodes.get('image'),
        inline: false,
        group: 'block',
      })
      .addToEnd('youtube_embed', {
        inline: false,
        group: 'block',
        attrs: {
          videoId: { default: '' }, // YouTube 비디오 ID
        },
        parseDOM: [
          {
            tag: 'iframe[src]',
            getAttrs(dom) {
              const src = dom.getAttribute('src');

              if (src) {
                const match = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);

                return match ? { videoId: match[1] } : false;
              }

              return false;
            },
          },
        ],
        toDOM(node) {
          const { videoId } = node.attrs;

          return [
            'iframe',
            {
              src: `https://www.youtube.com/embed/${videoId}`,
              frameborder: '0',
              allowfullscreen: 'true',
            },
          ];
        },
      }),
    marks: schema.spec.marks
      .addToEnd('underline', {
        parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
        toDOM: () => {
          return ['u', 0];
        },
      })
      .addToEnd('strike', {
        parseDOM: [{ tag: 'strike' }, { tag: 's' }, { style: 'text-decoration=line-through' }],
        toDOM: () => {
          return ['s', 0];
        },
      })
      .addToEnd('code', {
        parseDOM: [{ tag: 'code' }],
        toDOM() {
          return ['code', 0];
        },
      }),
  });

  private readonly _state: EditorState;

  constructor(private readonly _toastService: ToastService) {
    // 내부에서 사용되는 this의 바인딩을 위해
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.toggleBold = this.toggleBold.bind(this);
    this.toggleUnderline = this.toggleUnderline.bind(this);
    this.toggleItalic = this.toggleItalic.bind(this);
    this.increaseIndent = this.increaseIndent.bind(this);
    this.decreaseIndent = this.decreaseIndent.bind(this);

    this._state = EditorState.create({
      schema: this._schema,
      plugins: [
        history(),
        dropCursor({
          width: 3,
          color: colors.gray['400'],
          class: 'prosemirror-dropcursor-animation',
        }),
        inputRules({
          rules: [
            wrappingInputRule(/^\s*>\s$/, this._schema.nodes['blockquote']),
            wrappingInputRule(
              /^(\d+)\.\s$/,
              this._schema.nodes['ordered_list'],
              (match) => ({ order: +match[1] }),
              (match, node) => node.childCount + node.attrs['order'] == +match[1],
            ),
            wrappingInputRule(/^\s*([-+*])\s$/, this._schema.nodes['bullet_list']),
            textblockTypeInputRule(/^```$/, this._schema.nodes['code_block']),
            textblockTypeInputRule(new RegExp('^(#{1,6})\\s$'), this._schema.nodes['heading'], (match) => ({
              level: match[1].length,
            })),
          ],
        }),
        keymap({
          'Mod-z': this.undo,
          'Mod-s-z': this.redo,
          'Mod-y': this.redo,
          'Mod-b': this.toggleBold,
          'Mod-u': this.toggleUnderline,
          'Mod-i': this.toggleItalic,
          'Enter': splitListItem(this._schema.nodes['list_item']),
          'Tab': this.increaseIndent,
          'S-Tab': this.decreaseIndent,
        }),
        keymap(baseKeymap),
      ],
    });
  }

  get view(): EditorView | undefined {
    return this._view;
  }

  private _view?: EditorView;

  ngOnDestroy() {
    this._view?.destroy();
  }

  createView(parentElement: HTMLElement): void {
    this._view = new EditorView(parentElement, {
      state: this._state,
      attributes: { spellcheck: 'false' },
      nodeViews: {
        image: (node, view, getPos, decorations, innerDecorations) => {
          return new ImageNodeView(node, view, getPos);
        },
        youtube_embed: (node, view, getPos, decorations, innerDecorations) => {
          return new YoutubeEmbedNodeView(node, view, getPos);
        },
      },
      decorations: (state) => {
        const doc = state.doc;
        const decorations: Decoration[] = [];

        // 문서의 각 노드를 검사하여 빈 블록에 데코레이션 추가
        doc.descendants((node, pos) => {
          if (node.isBlock && node.childCount === 0) {
            let placeholder: string;

            switch (node.type.name) {
              case 'paragraph': {
                placeholder = '본문';
                break;
              }

              case 'heading': {
                placeholder = '제목';
                break;
              }

              default: {
                placeholder = '내용';
              }
            }

            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                'class': 'prosemirror-placeholder',
                'data-placeholder': placeholder,
              }),
            );
          }
        });

        return DecorationSet.create(doc, decorations);
      },
      handleKeyDown: (view, event) => {
        const { state, dispatch } = view;
        const { selection, doc } = state;
        const { $from, $to } = selection;

        // start + 1, end - 1을 해줘야 내부 텍스트만 선택됨
        // 그냥 start, end 를 사용하면 요소 바깥으로 선택되기 때문에 의도치 않은 오류 발생
        if (event.ctrlKey && event.key === 'a') {
          // 현재 블록 요소 범위 가져오기
          const blockRange = $from.blockRange($to);

          // 현재 블록이 완전히 선택되었는지 확인
          const isBlockFullySelected =
            blockRange && $from.pos === blockRange.start + 1 && $to.pos === blockRange.end - 1;

          if (!isBlockFullySelected) {
            // 현재 블록 전체 선택
            if (blockRange && blockRange.start + 1 < blockRange.end - 1) {
              const newSelection = TextSelection.create(doc, blockRange.start + 1, blockRange.end - 1);

              dispatch(state.tr.setSelection(newSelection));

              return true;
            }
          }

          // 에디터 전체 선택
          const newSelection = TextSelection.create(doc, 1, doc.content.size - 1);

          dispatch(state.tr.setSelection(newSelection));

          return true;
        }

        return false;
      },
      // 이미지 붙여넣기 시 ObjectURL로 src 설정
      // 붙여넣기 된 이미지는 files 배열에 추가
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;

        if (items) {
          for (let i = 0; i < items.length; i++) {
            const _item = items[i];

            if (_item.type.startsWith('image/')) {
              const file = _item.getAsFile();

              if (file) {
                this.insertImageFile(view, file);

                event.preventDefault();

                return true;
              }
            }
          }
        }

        return false;
      },
      // 이미지 드롭 시 ObjectURL로 src 설정
      // 드롭 된 이미지는 files 배열에 추가
      handleDrop: (view, event) => {
        const dataTransfer = event.dataTransfer;

        if (dataTransfer?.files?.length) {
          const file = dataTransfer.files[0];

          if (file.type.startsWith('image/')) {
            this.insertImageFile(view, file);

            event.preventDefault();

            return true;
          }
        }

        return false;
      },
    });
  }

  undo(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return undo(state, dispatch, view);
  }

  redo(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return redo(state, dispatch, view);
  }

  toggleBold(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return toggleMark(this._schema.marks['strong'])(state, dispatch, view);
  }

  toggleItalic(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return toggleMark(this._schema.marks['em'])(state, dispatch, view);
  }

  toggleUnderline(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return toggleMark(this._schema.marks['underline'])(state, dispatch, view);
  }

  toggleLineThrough(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return toggleMark(this._schema.marks['strike'])(state, dispatch, view);
  }

  insertBlockQuote(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return wrapIn(this._schema.nodes['blockquote'])(state, dispatch, view);
  }

  increaseIndent(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return sinkListItem(this._schema.nodes['list_item'])(state, dispatch, view);
  }

  decreaseIndent(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return liftListItem(this._schema.nodes['list_item'])(state, dispatch, view);
  }

  toggleHeading(level: number): boolean {
    if (this.view) {
      return setBlockType(this._schema.nodes['heading'], { level })(this.view.state, this.view.dispatch, this.view);
    }

    return false;
  }

  toggleParagraph(): boolean {
    if (this.view) {
      return setBlockType(this._schema.nodes['paragraph'])(this.view.state, this.view.dispatch, this.view);
    }

    return false;
  }

  setCodeBlock(): boolean {
    if (this.view) {
      return setBlockType(this._schema.nodes['code_block'])(this.view.state, this.view.dispatch, this.view);
    }

    return false;
  }

  toggleCode(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView): boolean {
    return toggleMark(this._schema.marks['code'])(state, dispatch, view);
  }

  insertYoutubeEmbed(url: string): boolean {
    if (this.view) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]+)/);

      if (!match) {
        this._toastService.open('잘못된 유튜브 영상 링크입니다');
        return false;
      }

      const videoId = match[1]; // 비디오 ID 추출

      const { state, dispatch } = this.view;
      const { tr, schema, selection } = state;
      const { $from } = selection;

      const rootBlockPos = $from.start(1);
      const rootBlockNode = $from.node(1);
      // 컨텐츠가 없는 노드의 경우 rootBlockNode가 undefined일 수도 있기 때문에 이에 다른 처리
      // rootBlockNode가 있을 때 nodeSize에서 1을 뺴는 이유는 1을 빼지 않으면 노드 바깥을 선택하기 때문
      const rootBlockEndPos = rootBlockNode ? rootBlockPos + rootBlockNode.nodeSize - 1 : rootBlockPos;

      let transaction = tr.insert(
        rootBlockEndPos,
        state.schema.nodes['youtube_embed'].create({
          videoId,
        }),
      );

      transaction = transaction.setSelection(NodeSelection.create(transaction.doc, rootBlockEndPos));

      dispatch(transaction);

      return true;
    }

    return false;
  }

  insertImageFile(view: EditorView, file: File): void {
    const { state, dispatch } = view;
    const { tr, schema, selection } = state;
    const { $from } = selection;

    const rootBlockPos = $from.start(1);
    const rootBlockNode = $from.node(1);
    // 컨텐츠가 없는 노드의 경우 rootBlockNode가 undefined일 수도 있기 때문에 이에 다른 처리
    // rootBlockNode가 있을 때 nodeSize에서 1을 뺴는 이유는 1을 빼지 않으면 노드 바깥을 선택하기 때문
    const rootBlockEndPos = rootBlockNode ? rootBlockPos + rootBlockNode.nodeSize - 1 : rootBlockPos;

    let transaction = tr.insert(
      rootBlockEndPos,
      schema.nodes['image'].create({
        src: URL.createObjectURL(file),
      }),
    );

    transaction = transaction.setSelection(NodeSelection.create(transaction.doc, rootBlockEndPos));

    dispatch(transaction);

    this.files.push(file);
  }

  getJson(): any | undefined {
    return this.view?.state.doc.toJSON();
  }
}
