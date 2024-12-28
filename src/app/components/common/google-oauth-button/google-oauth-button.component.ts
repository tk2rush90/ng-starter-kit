import { Component, HostListener, Inject } from '@angular/core';
import { IconGoogleLogoComponent } from '../../icons/icon-google-logo/icon-google-logo.component';
import { OauthService } from '../../../services/app/oauth/oauth.service';
import { environment } from '../../../../environments/environment';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_PREVIOUS_URL_KEY, OAUTH_STATE_KEY } from '../../../constants/storage-keys';
import { Location } from '@angular/common';
import { Platform } from '../../../utils/platform';

@Component({
    selector: 'app-google-oauth-button',
    imports: [IconGoogleLogoComponent],
    templateUrl: './google-oauth-button.component.html',
    styleUrl: './google-oauth-button.component.scss',
    host: {
        class: 'stroke-button gap-2',
        type: 'button',
        role: 'button',
    }
})
export class GoogleOauthButtonComponent {
  constructor(
    @Inject(Location) private readonly _location: Location,
    private readonly _oauthService: OauthService,
  ) {}

  @HostListener('click')
  onHostClick(): void {
    const state = crypto.randomUUID();

    LocalStorageUtil.set(OAUTH_STATE_KEY, state);
    LocalStorageUtil.set(OAUTH_PREVIOUS_URL_KEY, this._location.path(true));

    this._oauthService.getGoogleAccessToken({
      clientId: environment.google.clientId,
      redirectUri: Platform.isApp ? environment.google.appRedirectUri : environment.google.redirectUri,
      state,
    });
  }
}
