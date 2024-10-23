import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChainingNavigateOption } from '../../../data/chaining-navigate-option';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private readonly _router: Router) {}

  async chainingNavigate(options: ChainingNavigateOption[]): Promise<void> {
    for (const _option of options) {
      let routed = false;

      if (_option.navigateTo instanceof Array) {
        routed = await this._router.navigate(_option.navigateTo, _option.extra);
      } else {
        routed = await this._router.navigateByUrl(_option.navigateTo, _option.extra);
      }

      if (!routed) {
        break;
      }
    }
  }
}
