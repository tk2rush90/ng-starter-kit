import { EventEmitter, Injectable } from '@angular/core';
import { AuthApiService } from '../../api/auth-api/auth-api.service';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { ACCESS_TOKEN_KEY } from '../../../constants/storage-keys';
import { Login } from '../../../data/login';
import { BehaviorSubject, finalize, takeUntil } from 'rxjs';
import { Account } from '../../../data/account';
import { Profile } from '../../../data/profile';
import { HttpErrorResponse } from '@angular/common/http';
import { Join } from '../../../data/join';
import { GoogleIdToken } from '../../../data/google-id-token';
import { DeletedAccount } from '../../../data/deleted-account';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  joinLoading$ = new BehaviorSubject(false);

  loginLoading$ = new BehaviorSubject(false);

  logoutLoading$ = new BehaviorSubject(false);

  deleteAccountLoading$ = new BehaviorSubject(false);

  joined = new EventEmitter<Account>();

  loggedIn = new EventEmitter<Profile>();

  loggedOut = new EventEmitter<void>();

  accountDeleted = new EventEmitter<DeletedAccount>();

  joinFailed = new EventEmitter<HttpErrorResponse>();

  loginFailed = new EventEmitter<HttpErrorResponse>();

  logoutFailed = new EventEmitter<HttpErrorResponse>();

  deleteAccountFailed = new EventEmitter<HttpErrorResponse>();

  signedProfile$ = new BehaviorSubject<Profile | null>(null);

  signChecked$ = new BehaviorSubject(false);

  private _cancelJoin = new EventEmitter<void>();

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

  get joinLoading(): boolean {
    return this.joinLoading$.value;
  }

  set joinLoading(joinLoading: boolean) {
    this.joinLoading$.next(joinLoading);
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

  /**
   * Join.
   * @param email
   * @param nickname
   */
  join({ email, nickname }: Join): void {
    if (this.joinLoading) {
      return;
    }

    this.joinLoading = true;

    this._authApiService
      .join({ email, nickname })
      .pipe(takeUntil(this._cancelJoin))
      .pipe(finalize(() => (this.joinLoading = false)))
      .subscribe({
        next: (account) => this.joined.emit(account),
        error: (err: HttpErrorResponse) => this.joinFailed.emit(err),
      });
  }

  /**
   * Login.
   * @param email
   * @param otp
   */
  login({ email, otp }: Login): void {
    if (this.loginLoading) {
      return;
    }

    this.loginLoading = true;

    this._authApiService
      .login({ email, otp })
      .pipe(takeUntil(this._cancelLogin))
      .pipe(finalize(() => (this.loginLoading = false)))
      .subscribe({
        next: (profile) => this._onLogin(profile),
        error: (err: HttpErrorResponse) => this._onLoginFailed(err),
      });
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

  /**
   * Join by Google.
   * @param idToken
   */
  joinByGoogle({ idToken }: GoogleIdToken): void {
    if (this.joinLoading) {
      return;
    }

    this.joinLoading = true;

    this._authApiService
      .joinByGoogle({ idToken })
      .pipe(takeUntil(this._cancelJoin))
      .pipe(finalize(() => (this.joinLoading = false)))
      .subscribe({
        next: (account) => this.joined.emit(account),
        error: (err: HttpErrorResponse) => this.joinFailed.emit(err),
      });
  }

  /**
   * Login by Google.
   * @param idToken
   */
  loginByGoogle({ idToken }: GoogleIdToken): void {
    if (this.loginLoading) {
      return;
    }

    this.loginLoading = true;

    this._authApiService
      .loginByGoogle({ idToken })
      .pipe(takeUntil(this._cancelLogin))
      .pipe(finalize(() => (this.loginLoading = false)))
      .subscribe({
        next: (profile) => this._onLogin(profile),
        error: (err: HttpErrorResponse) => this._onLoginFailed(err),
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

  cancelJoin(): void {
    this._cancelJoin.emit();
  }

  cancelLogin(): void {
    this._cancelLogin.emit();
  }

  cancelLogout(): void {
    this._cancelLogout.emit();
  }
}
