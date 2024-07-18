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
import { JoinByGoogle } from '../../../data/join-by-google';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  joinLoading$ = new BehaviorSubject(false);

  loginLoading$ = new BehaviorSubject(false);

  logoutLoading$ = new BehaviorSubject(false);

  joined = new EventEmitter<Account>();

  loggedIn = new EventEmitter<Profile>();

  loggedOut = new EventEmitter<void>();

  joinFailed = new EventEmitter<HttpErrorResponse>();

  loginFailed = new EventEmitter<HttpErrorResponse>();

  logoutFailed = new EventEmitter<HttpErrorResponse>();

  signedProfile$ = new BehaviorSubject<Profile | null>(null);

  private _cancelJoin = new EventEmitter<void>();

  private _cancelLogin = new EventEmitter<void>();

  private _cancelLogout = new EventEmitter<void>();

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

  get signedProfile(): Profile | null {
    return this.signedProfile$.value;
  }

  set signedProfile(signedProfile: Profile | null) {
    this.signedProfile$.next(signedProfile);
  }

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

  joinByGoogle({ idToken }: JoinByGoogle): void {
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

  private _onLogin(profile: Profile): void {
    this.signedProfile = profile;
    this.accessToken = profile.accessToken;
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
