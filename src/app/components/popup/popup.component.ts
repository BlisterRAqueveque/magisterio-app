import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { PopupService } from './popup.service';
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkCircle, close, warning } from 'ionicons/icons';

export type Severity = 'ok' | 'warning' | 'danger';

@Component({
  standalone: true,
  imports: [CommonModule, IonIcon],
  selector: 'old-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PopupComponent {
  service = inject(PopupService);
  /** @description Duración del popup (0 para estático) */
  @Input() duration = 0;
  /** @description Grado de severidad */
  @Input() severity: Severity = 'ok';
  /** @description Cuerpo del mensaje */
  @Input() message = '';

  icon = 'checkmark-circle';

  hide = false;

  ngOnInit(): void {
    /** Creamos una instancia del ícono dependiendo de su renderizado */
    this.icon =
      this.severity === 'ok'
        ? 'checkmark-circle'
        : this.severity === 'danger'
        ? 'warning'
        : 'alert-circle';

    /** Seteamos la duración */
    if (this.duration !== 0)
      setTimeout(() => {
        this.close();
      }, this.duration);
  }

  present(message: string, severity: Severity, duration: number) {
    this.service.present(message, severity, duration);
  }

  /** @description Cierra el popup */
  close() {
    this.hide = true;
    setTimeout(() => {
      this.service.dismiss();
    }, 300);
  }

  constructor() {
    addIcons({ checkmarkCircle, close, warning, alertCircle });
  }
}
