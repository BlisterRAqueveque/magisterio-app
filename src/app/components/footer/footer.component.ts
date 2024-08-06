import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  callOutline,
  globeOutline,
  logoFacebook,
  logoInstagram,
  mapOutline,
} from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonicModule],
})
export class FooterComponent {
  constructor() {
    addIcons({
      logoFacebook,
      logoInstagram,
      globeOutline,
      mapOutline,
      callOutline,
    });
  }
}
