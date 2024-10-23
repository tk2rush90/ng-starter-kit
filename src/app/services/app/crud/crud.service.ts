import { DestroyRef, EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export abstract class CrudService<Data, C = Data, R = Data, U = Data, D = Data> {
  createLoading$ = new BehaviorSubject(false);

  created = new EventEmitter<C>();

  createFailed = new EventEmitter<HttpErrorResponse>();

  fetchLoading$ = new BehaviorSubject(false);

  fetched = new EventEmitter<R>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  updateLoading$ = new BehaviorSubject(false);

  updated = new EventEmitter<U>();

  updateFailed = new EventEmitter<HttpErrorResponse>();

  deleteLoading$ = new BehaviorSubject(false);

  deleted = new EventEmitter<D>();

  deleteFailed = new EventEmitter<HttpErrorResponse>();

  data$ = new BehaviorSubject<R | null>(null);

  onceFetched$ = new BehaviorSubject(false);

  private _cancelCreate = new EventEmitter<void>();

  private _cancelFetch = new EventEmitter<void>();

  private _cancelUpdate = new EventEmitter<void>();

  private _cancelDelete = new EventEmitter<void>();

  protected readonly _destroyRef = inject(DestroyRef);

  get createLoading(): boolean {
    return this.createLoading$.value;
  }

  set createLoading(value: boolean) {
    this.createLoading$.next(value);
  }

  get fetchLoading(): boolean {
    return this.fetchLoading$.value;
  }

  set fetchLoading(value: boolean) {
    this.fetchLoading$.next(value);
  }

  get updateLoading(): boolean {
    return this.updateLoading$.value;
  }

  set updateLoading(value: boolean) {
    this.updateLoading$.next(value);
  }

  get deleteLoading(): boolean {
    return this.deleteLoading$.value;
  }

  set deleteLoading(value: boolean) {
    this.deleteLoading$.next(value);
  }

  get data(): R | null {
    return this.data$.value;
  }

  set data(value: R | null) {
    this.data$.next(value);
  }

  get onceFetched(): boolean {
    return this.onceFetched$.value;
  }

  set onceFetched(value: boolean) {
    this.onceFetched$.next(value);
  }

  create(...params: any[]): void {
    throw new Error('Create method is not implemented');
  }

  fetch(...params: any[]): void {
    throw new Error('Fetch method is not implemented');
  }

  update(...params: any[]): void {
    throw new Error('Update method is not implemented');
  }

  delete(...params: any[]): void {
    throw new Error('Delete method is not implemented');
  }

  protected _handleCreateObservable(observable: Observable<C>): void {
    if (this.createLoading) {
      return;
    }

    this.createLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(takeUntil(this._cancelCreate))
      .pipe(finalize(() => (this.createLoading = false)))
      .subscribe({
        next: (data) => this.created.emit(data),
        error: (err: HttpErrorResponse) => this.createFailed.emit(err),
      });
  }

  protected _handleFetchObservable(observable: Observable<R>): void {
    if (this.fetchLoading) {
      return;
    }

    this.fetchLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(takeUntil(this._cancelFetch))
      .pipe(finalize(() => (this.fetchLoading = false)))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.onceFetched = true;
          this.fetched.emit(data);
        },
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }

  protected _handleUpdateObservable(observable: Observable<U>): void {
    if (this.updateLoading) {
      return;
    }

    this.updateLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(takeUntil(this._cancelUpdate))
      .pipe(finalize(() => (this.updateLoading = false)))
      .subscribe({
        next: (data) => this.updated.emit(data),
        error: (err: HttpErrorResponse) => this.updateFailed.emit(err),
      });
  }

  protected _handleDeleteObservable(observable: Observable<D>): void {
    if (this.deleteLoading) {
      return;
    }

    this.deleteLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(takeUntil(this._cancelDelete))
      .pipe(finalize(() => (this.deleteLoading = false)))
      .subscribe({
        next: (data) => this.deleted.emit(data),
        error: (err: HttpErrorResponse) => this.deleteFailed.emit(err),
      });
  }

  cancelCreate(): void {
    this._cancelCreate.emit();
  }

  cancelFetch(): void {
    this._cancelFetch.emit();
  }

  cancelUpdate(): void {
    this._cancelUpdate.emit();
  }

  cancelDelete(): void {
    this._cancelDelete.emit();
  }
}
