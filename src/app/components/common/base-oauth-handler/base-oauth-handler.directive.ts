import { DestroyRef, Directive, EventEmitter, inject, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../services/app/app/app.service';
import { AuthService } from '../../../services/app/auth/auth.service';
import { Platform } from '../../../utils/platform';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_PREVIOUS_URL_KEY, OAUTH_STATE_KEY } from '../../../constants/storage-keys';
import { HttpErrorResponse } from '@angular/common/http';

@Directive({
  selector: '[appBaseOauthHandler]',
  standalone: true,
})
export abstract class BaseOauthHandlerDirective {
  /** State 파라미터에 오류가 있을 때 */
  @Output() invalidState = new EventEmitter<void>();

  /** 앱 로그인 실패 시 */
  @Output() loginFailed = new EventEmitter<HttpErrorResponse>();

  /** OAuth 로그인 실패 시 */
  @Output() oauthError = new EventEmitter<string>();

  /** 로그인 성공 시 previousUrl 과 함께 방출 */
  @Output() success = new EventEmitter<string>();

  private readonly _location: Location = inject(Location);

  private readonly _appService: AppService = inject(AppService);

  protected readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly _authService: AuthService = inject(AuthService);

  protected constructor() {
    if (Platform.isBrowser) {
      // 상위 컴포넌트에서의 Login 방지
      this._authService.cancelLogin();

      this._authService.startFailed.pipe(takeUntilDestroyed()).subscribe((err) => this.loginFailed.emit(err));

      this._authService.started.pipe(takeUntilDestroyed()).subscribe(() => {
        const previousUrl = LocalStorageUtil.get(OAUTH_PREVIOUS_URL_KEY);

        LocalStorageUtil.remove(OAUTH_PREVIOUS_URL_KEY);
        LocalStorageUtil.remove(OAUTH_STATE_KEY);

        this.success.emit(previousUrl);
      });

      this._appService.isStable$.pipe(takeUntilDestroyed()).subscribe((isStable) => {
        if (isStable) {
          this.checkApp();
        }
      });
    }
  }

  checkApp(): void {
    this._activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((paramMap) => {
      const toApp = paramMap.get('toApp')?.toLowerCase() === 'true';

      if (toApp && !Platform.isApp) {
        location.href = 'post_at://post.vel-ca.com' + this._location.path(true);
      } else {
        this.handleOauthParameters();
      }
    });
  }

  abstract handleOauthParameters(): void;
}
