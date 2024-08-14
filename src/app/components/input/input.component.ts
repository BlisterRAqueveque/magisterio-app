import { CommonModule } from '@angular/common';
import { Component, Input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'm-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [IonIcon, CommonModule, FormsModule],
})
export class InputComponent {
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() label!: string;

  value = model<any>();
  @Input() error = false;
}
