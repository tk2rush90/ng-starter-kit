import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-link',
  standalone: true,
  imports: [],
  templateUrl: './icon-link.component.html',
  styleUrl: './icon-link.component.scss',
  host: {
    class: 'app-icon',
  },
})
export class IconLinkComponent {}
