import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  isStable$ = new BehaviorSubject(false);

  constructor(private readonly _applicationRef: ApplicationRef) {
    this._applicationRef.isStable.subscribe((isStable) => {
      if (isStable && !this.isStable) {
        this.isStable = isStable;
      }
    });
  }

  get isStable(): boolean {
    return this.isStable$.value;
  }

  set isStable(value: boolean) {
    this.isStable$.next(value);
  }
}
