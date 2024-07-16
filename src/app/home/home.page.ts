import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, NavbarComponent],
})
export class HomePage {
  isScroll = false;
  asd(event: CustomEvent) {
    if (event.detail.scrollTop < 100) {
      this.isScroll = false;
    } else {
      this.isScroll = true;
    }
  }
}
