import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeftSolid,
  heroChevronRightSolid,
} from '@ng-icons/heroicons/solid';
import { CardComponent } from '../components/card/card.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NavbarComponent,
    CardComponent,
    NgIcon,
  ],
  providers: [provideIcons({ heroChevronLeftSolid, heroChevronRightSolid })],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  isScroll = false;

  /** @description Guarda el height de los elementos sticky */
  height = 0;
  onScroll(event: CustomEvent) {
    if (event.detail.scrollTop < 50) {
      this.isScroll = false;
      this.height = 0;
    } else {
      this.isScroll = true;

      //* Obtenemos los elementos
      const header = document.querySelector('.header');
      const search = document.querySelector('#search');
      //* Calculamos el height
      this.height = header?.clientHeight! + search?.clientHeight! / 2;
    }
  }

  breakpoints = {
    640: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    820: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1460: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  };
}
