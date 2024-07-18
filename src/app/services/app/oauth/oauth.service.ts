import { EventEmitter, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  googleApiLoaded = new EventEmitter<void>();

  constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  addGoogleApiScript(): void {
    const script = this._document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.addEventListener('load', () => {
      this.googleApiLoaded.emit();
    });

    this._document.body.appendChild(script);
  }

  initializeGoogleApi(options: Partial<google.accounts.id.IdConfiguration> = {}): void {
    google.accounts.id.initialize({
      client_id: environment.google.clientId,
      ...options,
    });
  }

  openGoogleOneTap(): void {
    google.accounts.id.prompt();
  }

  createGoogleButton(parent: HTMLElement, options: google.accounts.id.GsiButtonConfiguration): void {
    google.accounts.id.renderButton(parent, options);
  }
}
