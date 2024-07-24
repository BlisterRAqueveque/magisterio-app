import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlusSolid } from '@ng-icons/heroicons/solid';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [provideIcons({ heroPlusSolid })],
  imports: [IonIcon, NgIcon],
})
export class CardComponent {}
