import { Component, HostListener, Inject } from '@angular/core';
import { IconKakaoComponent } from '../../icons/icon-kakao/icon-kakao.component';
import { Location } from '@angular/common';
import { OauthService } from '../../../services/app/oauth/oauth.service';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_PREVIOUS_URL_KEY, OAUTH_STATE_KEY } from '../../../constants/storage-keys';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-kakao-oauth-button',
  standalone: true,
  imports: [IconKakaoComponent],
  templateUrl: './kakao-oauth-button.component.html',
  styleUrl: './kakao-oauth-button.component.scss',
  host: {
    class: 'flat-button gap-2 kakao',
    type: 'button',
    role: 'button',
  },
})
export class KakaoOauthButtonComponent {
  constructor(
    @Inject(Location) private readonly _location: Location,
    private readonly _oauthService: OauthService,
  ) {}

  @HostListener('click')
  onHostClick(): void {
    const state = crypto.randomUUID();

    LocalStorageUtil.set(OAUTH_STATE_KEY, state);
    LocalStorageUtil.set(OAUTH_PREVIOUS_URL_KEY, this._location.path(true));

    this._oauthService.getKakaoCode({
      clientId: environment.kakao.clientId,
      redirectUri: environment.kakao.redirectUri,
      state,
    });
  }
}
