import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wysiwyg-editor-button',
  standalone: true,
  imports: [],
  templateUrl: './wysiwyg-editor-button.component.html',
  styleUrl: './wysiwyg-editor-button.component.scss',
})
export class WysiwygEditorButtonComponent {
  @Output() clickButton = new EventEmitter<void>();
}
