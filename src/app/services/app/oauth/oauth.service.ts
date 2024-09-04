import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleRedirectOptions } from '../../../data/google-redirect-options';

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  getGoogleAccessToken({
    clientId,
    redirectUri,
    scope = ['email', 'profile'],
    prompt,
    state,
    includeGrantedScopes,
    enableGranularConsent,
    loginHint,
  }: GoogleRedirectOptions): void {
    const url = new URL(environment.host.googleOauth2 + '/auth');

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('scope', scope.join(' '));

    if (prompt !== undefined) {
      url.searchParams.set('prompt', prompt);
    }

    if (includeGrantedScopes !== undefined) {
      url.searchParams.set('include_granted_scopes', String(includeGrantedScopes));
    }

    if (enableGranularConsent !== undefined) {
      url.searchParams.set('enable_granular_consent', String(enableGranularConsent));
    }

    if (loginHint !== undefined) {
      url.searchParams.set('login_hint', loginHint);
    }

    if (state !== undefined) {
      url.searchParams.set('state', state);
    }

    location.href = url.toString();
  }
}
