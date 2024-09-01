import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
} from '@angular/core';
import { IngresoParcelaI } from 'src/app/models/ingreso-parcela';
import { ReservasService } from 'src/app/service/reservas.service';
import { DialogService } from '../confirm-dialog/dialog.service';
import { LoaderService } from '../loader/loader.service';
import { InputComponent } from '../input/input.component';
import { CommonModule } from '@angular/common';
import { Data } from 'src/app/scanner/scanner.component';
import { IngresosService } from 'src/app/service/ingresos.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'm-modal-parcelas',
  templateUrl: './modal-parcelas.component.html',
  styleUrls: ['./modal-parcelas.component.scss'],
  imports: [InputComponent, CommonModule],
})
export class ModalParcelasComponent {
  show = false;

  visible = model<boolean>(false);

  ngAfterViewInit() {
    setTimeout(() => {
      this.show = true;
    }, 100);
  }

  //* Entity values
  nombre!: string;
  n_socio!: string;
  //* End entity values
  error = false;

  private readonly dialog = inject(DialogService);
  private readonly loader = inject(LoaderService);
  private readonly service = inject(IngresosService);
  private readonly router = inject(Router);

  upload() {
    this.error = false;
    if (this.nombre && this.n_socio && this.parcela) {
      this.dialog.present(
        'Confirmación de carga',
        `Está a punto de ${
          this.type == 1 ? 'marcar ingreso' : 'marcar salida'
        } en la parcela : ${this.parcela.nombre}. ¿Desea continuar?`,
        () => {
          switch (this.type) {
            case 1: {
              this.onUpload();
              break;
            }
            case 0: {
              this.onUpdate();
              break;
            }
            default: {
            }
          }
        }
      );
    } else {
      this.error = true;
    }
  }
  onUpload() {
    this.loader.present();
    const data: Partial<IngresoParcelaI> = {
      n_socio: this.n_socio,
      nombre: this.nombre,
      parcela: { id: this.parcela.id },
    };
    this.service.insert(data).subscribe({
      next: (data) => {
        this.loader.dismiss();
        setTimeout(() => {
          this.dialog.confirmAction(
            'Confirmación de carga',
            'Su ingreso fue marcado con éxito. Recuerde que, al finalizar, debe marcar su salida.',
            () => {
              this.ended.emit(true);
              this.hide();
              this.router.navigate(['/home']);
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

  onUpdate() {
    this.loader.present();
    const data: Partial<IngresoParcelaI> = {
      n_socio: this.n_socio,
      nombre_salida: this.nombre,
      salida_fecha: new Date(),
    };
    this.service.update(this.parcela.id, data).subscribe({
      next: (data) => {
        this.loader.dismiss();
        setTimeout(() => {
          this.dialog.confirmAction(
            'Confirmación de carga',
            'Su salida fue marcada con éxito. ¡Gracias por su visita!.',
            () => {
              this.ended.emit(true);
              this.hide();
              this.router.navigate(['/home']);
            }
          );
        }, 100);
      },
      error: (e) => {
        this.loader.dismiss();
        console.error('PARCELA', JSON.stringify(e));
        if (e.error) {
          switch (e.error.statusCode) {
            case 401: {
              setTimeout(() => {
                this.dialog.error(
                  'Error de carga',
                  'El número de socio no concuerda con la información provista. Si nota algún deficiente, comuníquese con la administración.',
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

  @Input() parcela!: Data;
  @Input() type!: number;
  @Output() ended = new EventEmitter<boolean>(false);

  hide() {
    this.visible.set(false);
    this.resetValues();
  }

  resetValues() {
    this.nombre = '';
    this.n_socio = '';
  }
}
