import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'm-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [IonIcon],
})
export class InputComponent {
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() label!: string;
}
