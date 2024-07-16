import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() placeholder!: string
}
