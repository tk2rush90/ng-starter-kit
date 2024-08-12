import { DestroyRef, EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { PagingResult } from '../../../data/paging-result';

@Injectable()
export abstract class PagingListService<Data> {
  fetchLoading$ = new BehaviorSubject(false);

  fetched = new EventEmitter<PagingResult<Data>>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  data$ = new BehaviorSubject<Data[]>([]);

  nextCursor$ = new BehaviorSubject<string | undefined>(undefined);

  fetchedOnce$ = new BehaviorSubject(false);

  protected readonly _destroyRef = inject(DestroyRef);

  get fetchLoading(): boolean {
    return this.fetchLoading$.value;
  }

  set fetchLoading(value: boolean) {
    this.fetchLoading$.next(value);
  }

  get data(): Data[] {
    return this.data$.value;
  }

  set data(value: Data[]) {
    this.data$.next(value);
  }

  get nextCursor(): string | undefined {
    return this.nextCursor$.value;
  }

  set nextCursor(value: string | undefined) {
    this.nextCursor$.next(value);
  }

  get fetchedOnce(): boolean {
    return this.fetchedOnce$.value;
  }

  set fetchedOnce(value: boolean) {
    this.fetchedOnce$.next(value);
  }

  fetch(...params: any[]): void {
    throw new Error('Fetch method is not implemented');
  }

  protected _handleFetchObservable(observable: Observable<PagingResult<Data>>): void {
    if (this.fetchLoading) {
      return;
    }

    this.fetchLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(finalize(() => (this.fetchLoading = false)))
      .subscribe({
        next: (result) => {
          this.data = [...this.data, ...result.data];
          this.nextCursor = result.nextCursor;
          this.fetchedOnce = true;
          this.fetched.emit(result);
        },
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }
}
