import { DestroyRef, EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export abstract class CrudService<Data> {
  createLoading$ = new BehaviorSubject(false);

  created = new EventEmitter<Data>();

  createFailed = new EventEmitter<HttpErrorResponse>();

  fetchLoading$ = new BehaviorSubject(false);

  fetched = new EventEmitter<Data>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  updateLoading$ = new BehaviorSubject(false);

  updated = new EventEmitter<Data>();

  updateFailed = new EventEmitter<HttpErrorResponse>();

  deleteLoading$ = new BehaviorSubject(false);

  deleted = new EventEmitter<Data>();

  deleteFailed = new EventEmitter<HttpErrorResponse>();

  data$ = new BehaviorSubject<Data | null>(null);

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

  get data(): Data | null {
    return this.data$.value;
  }

  set data(value: Data | null) {
    this.data$.next(value);
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

  protected _handleCreateObservable(observable: Observable<Data>): void {
    if (this.createLoading) {
      return;
    }

    this.createLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(finalize(() => (this.createLoading = false)))
      .subscribe({
        next: (data) => this.created.emit(data),
        error: (err: HttpErrorResponse) => this.createFailed.emit(err),
      });
  }

  protected _handleFetchObservable(observable: Observable<Data>): void {
    if (this.fetchLoading) {
      return;
    }

    this.fetchLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(finalize(() => (this.fetchLoading = false)))
      .subscribe({
        next: (data) => this.fetched.emit(data),
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }

  protected _handleUpdateObservable(observable: Observable<Data>): void {
    if (this.updateLoading) {
      return;
    }

    this.updateLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(finalize(() => (this.updateLoading = false)))
      .subscribe({
        next: (data) => this.updated.emit(data),
        error: (err: HttpErrorResponse) => this.updateFailed.emit(err),
      });
  }

  protected _handleDeleteObservable(observable: Observable<Data>): void {
    if (this.deleteLoading) {
      return;
    }

    this.deleteLoading = true;

    observable
      .pipe(takeUntilDestroyed(this._destroyRef))
      .pipe(finalize(() => (this.deleteLoading = false)))
      .subscribe({
        next: (data) => this.deleted.emit(data),
        error: (err: HttpErrorResponse) => this.deleteFailed.emit(err),
      });
  }
}
