import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'm-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class InputComponent {
  @Output() onBlur = new EventEmitter<boolean>();
  blur() {
    this.onBlur.emit(true);
  }

  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() label!: string;

  value = model<any>();
  @Input() error = false;
}
