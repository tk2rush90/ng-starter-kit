import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-image',
  standalone: true,
  imports: [],
  templateUrl: './icon-image.component.html',
  styleUrl: './icon-image.component.scss',
  host: {
    class: 'app-icon',
  },
})
export class IconImageComponent {}
