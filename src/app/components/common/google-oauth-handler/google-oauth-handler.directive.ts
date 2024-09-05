import { Directive, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/app/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_PREVIOUS_URL_KEY, OAUTH_STATE_KEY } from '../../../constants/storage-keys';

/** Handles access token retrieved by Google oauth to join or login to App */
@Directive({
  selector: '[appGoogleOauthHandler]',
  standalone: true,
})
export class GoogleOauthHandlerDirective {
  /** Emit when `state` param is mismatched */
  @Output() invalidState = new EventEmitter<void>();

  /** Emit `HttpErrorResponse` from the `startByGoogle()` API */
  @Output() loginFailed = new EventEmitter<HttpErrorResponse>();

  /** Emit `error` param from the fragment */
  @Output() oauthError = new EventEmitter<string>();

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _authService: AuthService,
  ) {
    // to prevent `autoLogin()` from the app component
    this._authService.cancelLogin();

    this._authService.startFailed.pipe(takeUntilDestroyed()).subscribe((err) => this.loginFailed.emit(err));

    this._authService.started.pipe(takeUntilDestroyed()).subscribe(() => {
      const previousUrl = LocalStorageUtil.get(OAUTH_PREVIOUS_URL_KEY);

      LocalStorageUtil.remove(OAUTH_PREVIOUS_URL_KEY);
      LocalStorageUtil.remove(OAUTH_STATE_KEY);

      if (previousUrl) {
        this._router.navigateByUrl(previousUrl, {
          replaceUrl: true,
        });
      } else {
        this._router.navigate(['/'], {
          replaceUrl: true,
        });
      }
    });

    this._activatedRoute.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      if (fragment) {
        const urlSearchParams = new URLSearchParams(fragment);

        const error = urlSearchParams.get('error');

        if (error) {
          this.oauthError.emit(error);
          return;
        }

        const state = urlSearchParams.get('state');

        // when `state` specified, check it
        if (state && LocalStorageUtil.get(OAUTH_STATE_KEY) !== state) {
          this.invalidState.emit();
          return;
        }

        const accessToken = urlSearchParams.get('access_token');

        if (accessToken) {
          this._authService.startByGoogle(accessToken);
        }
      }
    });
  }
}
