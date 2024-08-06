import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPhoneSolid } from '@ng-icons/heroicons/solid';

@Component({
  standalone: true,
  selector: 'm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NgIcon, CommonModule],
  providers: [
    provideIcons({
      heroPhoneSolid,
    }),
  ],
})
export class NavbarComponent {
  @Input() scroll = false;
  @Input() height = 0;

  @ContentChild('customContent') customContent!: TemplateRef<any>;
}
