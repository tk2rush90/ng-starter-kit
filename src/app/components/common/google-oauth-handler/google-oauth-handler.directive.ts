import { Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/app/auth/auth.service';

/** Handles access token retrieved by Google oauth to join or login to App */
@Directive({
  selector: '[appGoogleOauthHandler]',
  standalone: true,
})
export class GoogleOauthHandlerDirective {
  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _authService: AuthService,
  ) {
    this._activatedRoute.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      if (fragment) {
        const urlSearchParams = new URLSearchParams(fragment);

        const accessToken = urlSearchParams.get('access_token');

        if (accessToken) {
          this._authService.startByGoogle(accessToken);
        }
      }
    });
  }
}
