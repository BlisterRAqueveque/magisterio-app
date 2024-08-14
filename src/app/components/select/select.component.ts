import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMarkSolid } from '@ng-icons/heroicons/solid';

@Component({
  standalone: true,
  selector: 'm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [CommonModule, FormsModule, NgIcon],
  providers: [provideIcons({ heroXMarkSolid })],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [animate(200)]),
    ]),
  ],
})
export class SelectComponent {
  /** @description Placeholder del select option */
  @Input() placeholder!: string;
  /** @description La propiedad para acceder al valor seleccionado */
  @Input() optionLabel!: string;
  /** @description Los valores para recorrer y mostrar en la lista */
  @Input() options!: any;
  /** @description La propiedad para acceder al valor que se mostrara en las opciones */
  @Input() optionValue!: string;

  focus = false;

  value!: string;

  selectedValue = model<any>();

  getValue() {
    if (this.value) {
      const item = this.options.find(
        (i: any) => i[this.optionLabel] == this.value
      );
      this.selectedValue.set(item);
    }
  }

  @Output() onDelete = new EventEmitter<boolean>(false);
  deleteValue() {
    this.onDelete.emit(true);
    this.value = '';
    this.selectedValue.set(undefined);
  }
}
