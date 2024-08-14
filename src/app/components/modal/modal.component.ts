import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { DialogService } from '../confirm-dialog/dialog.service';
import { LoaderService } from '../loader/loader.service';
import { formatDate } from 'src/app/tools/format-date';
import { ReservasService } from 'src/app/service/reservas.service';
import { ReservaI } from 'src/app/models/reservas';
import { HabitacionI } from 'src/app/models/habitaciones';

@Component({
  standalone: true,
  selector: 'm-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, FormsModule, InputComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  providers: [DialogService],
})
export class ModalComponent {
  show = false;

  visible = model<boolean>(false);

  ngAfterViewInit() {
    setTimeout(() => {
      this.show = true;
    }, 100);
  }

  //* Entity values
  nombre!: string;
  apellido!: string;
  n_socio!: string;
  tel!: string;
  correo!: string;
  //* End entity values
  error = false;

  private readonly dialog = inject(DialogService);
  private readonly loader = inject(LoaderService);
  private readonly service = inject(ReservasService);

  upload() {
    this.error = false;
    if (
      this.nombre &&
      this.apellido &&
      this.n_socio &&
      this.tel &&
      this.correo &&
      this.desde &&
      this.hasta &&
      this.habitacion
    ) {
      this.dialog.present(
        'Confirmación de carga',
        `Está a punto de cargar la siguiente reserva, desde: ${formatDate(
          this.desde.toDateString()
        )}, hasta: ${formatDate(this.hasta.toDateString())}. ¿Desea continuar?`,
        () => {
          this.loader.present();
          const data: Partial<ReservaI> = {
            nombre: this.nombre,
            apellido: this.apellido,
            n_socio: this.n_socio,
            tel: this.tel,
            correo: this.correo,
            desde: this.desde,
            hasta: this.hasta,
            habitacion: this.habitacion,
          };
          this.service.insert(data).subscribe({
            next: (data) => {
              this.loader.dismiss();
              setTimeout(() => {
                this.dialog.confirmAction(
                  'Confirmación de carga',
                  'La reserva fue cargada correctamente. Ahora solo debe aguardar a la confirmación por parte del personal.',
                  () => {
                    this.ended.emit(true);
                    this.hide();
                  }
                );
              }, 100);
            },
            error: (e) => {
              this.loader.dismiss();
              console.error(e);
              if (e.error) {
                switch (e.error.statusCode) {
                  case 401: {
                    setTimeout(() => {
                      this.dialog.error(
                        'Error de carga',
                        'Revise la información provista, faltan datos.',
                        () => {}
                      );
                    }, 100);
                    break;
                  }
                  case 409: {
                    setTimeout(() => {
                      this.dialog.error(
                        'Error de carga',
                        'Ya hay una reserva cargada entre esas fechas.',
                        () => {}
                      );
                    }, 100);
                    break;
                  }
                  default: {
                    setTimeout(() => {
                      this.dialog.error(
                        'Error de carga',
                        'Ocurrió un error durante la carga.',
                        () => {}
                      );
                    }, 100);
                    break;
                  }
                }
              } else {
                setTimeout(() => {
                  this.dialog.error(
                    'Error de carga',
                    'Ocurrió un error durante la carga.',
                    () => {}
                  );
                }, 100);
              }
            },
          });
        }
      );
    } else {
      this.error = true;
    }
  }

  @Input() desde!: Date;
  @Input() hasta!: Date;
  @Input() habitacion!: HabitacionI;
  @Output() ended = new EventEmitter<boolean>(false);

  hide() {
    this.visible.set(false);
    this.resetValues();
  }

  resetValues() {
    this.nombre = '';
    this.apellido = '';
    this.n_socio = '';
    this.tel = '';
    this.correo = '';
  }
}
