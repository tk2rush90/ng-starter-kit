import { EventEmitter, Injectable } from '@angular/core';
import { AuthApiService } from '../../api/auth-api/auth-api.service';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { ACCESS_TOKEN_KEY } from '../../../constants/storage-keys';
import { BehaviorSubject, finalize, takeUntil } from 'rxjs';
import { Profile } from '../../../data/profile';
import { HttpErrorResponse } from '@angular/common/http';
import { DeletedAccount } from '../../../data/deleted-account';
import { StartByKakao } from '../../../data/start-by-kakao';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  startLoading$ = new BehaviorSubject(false);

  loginLoading$ = new BehaviorSubject(false);

  logoutLoading$ = new BehaviorSubject(false);

  deleteAccountLoading$ = new BehaviorSubject(false);

  started = new EventEmitter<Profile>();

  loggedIn = new EventEmitter<Profile>();

  loggedOut = new EventEmitter<void>();

  accountDeleted = new EventEmitter<DeletedAccount>();

  startFailed = new EventEmitter<HttpErrorResponse>();

  loginFailed = new EventEmitter<HttpErrorResponse>();

  logoutFailed = new EventEmitter<HttpErrorResponse>();

  deleteAccountFailed = new EventEmitter<HttpErrorResponse>();

  signedProfile$ = new BehaviorSubject<Profile | null>(null);

  signChecked$ = new BehaviorSubject(false);

  private _cancelStart = new EventEmitter<void>();

  private _cancelLogin = new EventEmitter<void>();

  private _cancelLogout = new EventEmitter<void>();

  private _cancelDeleteAccount = new EventEmitter<void>();

  constructor(private readonly _authApiService: AuthApiService) {}

  get accessToken(): string {
    return LocalStorageUtil.get(ACCESS_TOKEN_KEY);
  }

  set accessToken(accessToken: string) {
    LocalStorageUtil.set(ACCESS_TOKEN_KEY, accessToken);
  }

  get startLoading(): boolean {
    return this.startLoading$.value;
  }

  set startLoading(startLoading: boolean) {
    this.startLoading$.next(startLoading);
  }

  get loginLoading(): boolean {
    return this.loginLoading$.value;
  }

  set loginLoading(loginLoading: boolean) {
    this.loginLoading$.next(loginLoading);
  }

  get logoutLoading(): boolean {
    return this.logoutLoading$.value;
  }

  set logoutLoading(logoutLoading: boolean) {
    this.logoutLoading$.next(logoutLoading);
  }

  get deleteAccountLoading(): boolean {
    return this.deleteAccountLoading$.value;
  }

  set deleteAccountLoading(deleteAccountLoading: boolean) {
    this.deleteAccountLoading$.next(deleteAccountLoading);
  }

  get signedProfile(): Profile | null {
    return this.signedProfile$.value;
  }

  set signedProfile(signedProfile: Profile | null) {
    this.signedProfile$.next(signedProfile);
  }

  get signChecked(): boolean {
    return this.signChecked$.value;
  }

  set signChecked(value: boolean) {
    this.signChecked$.next(value);
  }

  /** Auto login */
  autoLogin(): void {
    if (this.loginLoading) {
      return;
    }

    this.loginLoading = true;

    this._authApiService
      .autoLogin()
      .pipe(takeUntil(this._cancelLogin))
      .pipe(finalize(() => (this.loginLoading = false)))
      .subscribe({
        next: (profile) => this._onLogin(profile),
        error: (err: HttpErrorResponse) => this._onLoginFailed(err),
      });
  }

  /** Logout */
  logout(): void {
    if (this.logoutLoading) {
      return;
    }

    this.logoutLoading = true;

    this._authApiService
      .logout()
      .pipe(takeUntil(this._cancelLogout))
      .pipe(
        finalize(() => {
          this.logoutLoading = false;
          this.signedProfile = null;
          this.accessToken = '';
        }),
      )
      .subscribe({
        next: () => this.loggedOut.emit(),
        error: (err: HttpErrorResponse) => this.logoutFailed.emit(err),
      });
  }

  startByGoogle(accessToken: string): void {
    if (this.startLoading) {
      return;
    }

    this.startLoading = true;

    this._authApiService
      .startByGoogle(accessToken)
      .pipe(takeUntil(this._cancelStart))
      .pipe(finalize(() => (this.startLoading = false)))
      .subscribe({
        next: (profile) => {
          this.signedProfile = profile;
          this.accessToken = profile.accessToken;
          this.signChecked = true;
          this.started.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.startFailed.emit(err);
        },
      });
  }

  startByKakao(body: StartByKakao): void {
    if (this.startLoading) {
      return;
    }

    this.startLoading = true;

    this._authApiService
      .startByKakao(body)
      .pipe(takeUntil(this._cancelStart))
      .pipe(finalize(() => (this.startLoading = false)))
      .subscribe({
        next: (profile) => {
          this.signedProfile = profile;
          this.accessToken = profile.accessToken;
          this.signChecked = true;
          this.started.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.startFailed.emit(err);
        },
      });
  }

  /** Delete account */
  deleteAccount(): void {
    if (this.deleteAccountLoading) {
      return;
    }

    this.deleteAccountLoading = true;

    this._authApiService
      .deleteAccount()
      .pipe(takeUntil(this._cancelDeleteAccount))
      .pipe(finalize(() => (this.deleteAccountLoading = false)))
      .subscribe({
        next: (deletedAccount) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.accountDeleted.emit(deletedAccount);
        },
        error: (err: HttpErrorResponse) => this.deleteAccountFailed.emit(err),
      });
  }

  private _onLogin(profile: Profile): void {
    this.signedProfile = profile;
    this.accessToken = profile.accessToken;
    this.signChecked = true;
    this.loggedIn.emit(profile);
  }

  private _onLoginFailed(err: HttpErrorResponse): void {
    this.signedProfile = null;
    this.accessToken = '';
    this.loginFailed.emit(err);
  }

  cancelStart(): void {
    this._cancelStart.emit();
  }

  cancelLogin(): void {
    this._cancelLogin.emit();
  }

  cancelLogout(): void {
    this._cancelLogout.emit();
  }
}
