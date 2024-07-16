import { Component, HostListener, Input } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowsRightLeftSolid,
  heroMagnifyingGlassSolid,
  heroPhoneSolid,
} from '@ng-icons/heroicons/solid';
import { SelectComponent } from '../select/select.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [InputComponent, SelectComponent, IonIcon, NgIcon, CommonModule],
  providers: [
    provideIcons({
      heroArrowsRightLeftSolid,
      heroMagnifyingGlassSolid,
      heroPhoneSolid,
    }),
  ],
})
export class NavbarComponent {
  @Input() scroll = false;
}
