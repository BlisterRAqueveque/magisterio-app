import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeftSolid,
  heroChevronRightSolid,
} from '@ng-icons/heroicons/solid';
import { PressDirective } from 'src/app/directives/press/press.directive';
import { ReservaI } from 'src/app/models/reservas';
import { ReservasService } from 'src/app/service/reservas.service';

@Component({
  standalone: true,
  selector: 'm-calendar',
  imports: [CommonModule, NgIcon, PressDirective],
  providers: [provideIcons({ heroChevronLeftSolid, heroChevronRightSolid })],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() show = false;

  semana: { id: number; nombre: string; nombreShort: string }[] = [
    { id: 0, nombre: 'Domingo', nombreShort: 'Do' },
    { id: 1, nombre: 'Lunes', nombreShort: 'Lu' },
    { id: 2, nombre: 'Martes', nombreShort: 'Ma' },
    { id: 3, nombre: 'Miércoles', nombreShort: 'Mi' },
    { id: 4, nombre: 'Jueves', nombreShort: 'Ju' },
    { id: 5, nombre: 'Viernes', nombreShort: 'Vi' },
    { id: 6, nombre: 'Sábado', nombreShort: 'Sa' },
  ];
  meses: { id: number; nombre: string; nombreShort: string }[] = [
    { id: 0, nombre: 'Enero', nombreShort: 'Ene' },
    { id: 1, nombre: 'Febrero', nombreShort: 'Feb' },
    { id: 2, nombre: 'Marzo', nombreShort: 'Mar' },
    { id: 3, nombre: 'Abril', nombreShort: 'Abr' },
    { id: 4, nombre: 'Mayo', nombreShort: 'May' },
    { id: 5, nombre: 'Junio', nombreShort: 'Jun' },
    { id: 6, nombre: 'Julio', nombreShort: 'Jul' },
    { id: 7, nombre: 'Agosto', nombreShort: 'Ago' },
    { id: 8, nombre: 'Septiembre', nombreShort: 'Sep' },
    { id: 9, nombre: 'Octubre', nombreShort: 'Oct' },
    { id: 10, nombre: 'Noviembre', nombreShort: 'Nov' },
    { id: 11, nombre: 'Diciembre', nombreShort: 'Dic' },
  ];

  hoy = new Date();

  ngOnInit() {
    const mAnterior = new Date(
      this.hoy.getFullYear(),
      this.hoy.getMonth() - 1,
      1
    );
    this.mesActual = this.obtenerMes(this.hoy);
    const mProximo = new Date(
      this.hoy.getFullYear(),
      this.hoy.getMonth() + 1,
      1
    );
    this.mesAnterior = this.obtenerMes(mAnterior);
    this.mesActual = this.obtenerMes(this.hoy);
    this.mesProximo = this.obtenerMes(mProximo);

    this.porSemana(this.mesAnterior, this.mesActual, this.mesProximo);
  }
  primerDia!: Date;

  ultimoDia!: Date;

  obtenerMes(dia: Date) {
    this.primerDia = new Date(dia.getFullYear(), dia.getMonth(), 1);
    this.ultimoDia = new Date(dia.getFullYear(), dia.getMonth() + 1, 0);
    const mes: Date[] = [];
    for (
      let i = new Date(this.primerDia);
      i <= this.ultimoDia;
      i.setDate(i.getDate() + 1)
    ) {
      mes.push(new Date(i));
    }
    return mes;
  }

  mesAnterior: Date[] = [];
  mesActual: Date[] = [];
  mesProximo: Date[] = [];

  siguienteMes() {
    const mAnterior = new Date(this.hoy);
    this.hoy.setMonth(this.hoy.getMonth() + 1);
    const mProximo = new Date(
      this.hoy.getFullYear(),
      this.hoy.getMonth() + 1,
      1
    );
    this.mesAnterior = this.obtenerMes(mAnterior);
    this.mesActual = this.obtenerMes(this.hoy);
    this.mesProximo = this.obtenerMes(mProximo);

    this.porSemana(this.mesAnterior, this.mesActual, this.mesProximo);

    this.semanas.forEach((d) => {
      d.dias.forEach((dd) => {
        this.datesReservadas(dd);
      });
    });
  }

  anteriorMes() {
    const mProximo = new Date(this.hoy);
    this.hoy.setMonth(this.hoy.getMonth() - 1);
    const mAnterior = new Date(
      this.hoy.getFullYear(),
      this.hoy.getMonth() - 1,
      1
    );
    this.mesAnterior = this.obtenerMes(mAnterior);
    this.mesActual = this.obtenerMes(this.hoy);
    this.mesProximo = this.obtenerMes(mProximo);

    this.porSemana(this.mesAnterior, this.mesActual, this.mesProximo);

    this.semanas.forEach((d) => {
      d.dias.forEach((dd) => {
        this.datesReservadas(dd);
      });
    });
  }

  porSemana(mesAnt: Date[], mes: Date[], mesPr: Date[]) {
    const semanas: {
      dias: { dia: Date; enable: boolean; reserva: boolean }[];
    }[] = [];
    let semana: { dia: Date; enable: boolean; reserva: boolean }[] = [];
    mes.forEach((d, i) => {
      /**
       * @description
       * Comparamos que el primer index del mes, sea del día | semana === 0,
       * correspondiente al domingo
       */
      if (i === 0 && d.getDay() !== 0) {
        let index = mesAnt.length - 1;
        for (let i = d.getDay(); i > 0; i--) {
          //* Agregamos los días en la lista
          semana.unshift({ dia: mesAnt[index], enable: true, reserva: false });
          index--;
        }
      }
      //* Pusheamos los días en la semana
      semana.push({ dia: d, enable: true, reserva: false });
      if (semana.length === 7) {
        //* Pusheamos la semana en las semanas (en caso de cumplir la condición de ser 7 los días almacenados)
        semanas.push({ dias: semana });
        //* Vaciamos la lista
        semana = [];
      } else if (i === mes.length - 1 && semana.length !== 7) {
        //* Si la semana no se completó, agregamos los días restantes
        let index = 0;
        for (let j = semana.length; j < 7; j++) {
          semana.push({ dia: mesPr[index], enable: true, reserva: false });
          index++;
        }
        //* Pusheamos la semana en las semanas (en caso de cumplir la condición de ser 7 los días almacenados)
        semanas.push({ dias: semana });
        //* Vaciamos la lista
        semana = [];
      }
    });
    //* Retornamos las semanas creadas
    this.semanas = semanas;
  }

  semanas: { dias: { dia: Date; enable: boolean; reserva: boolean }[] }[] = [];

  isMonth(date: Date) {
    return date.getMonth() === this.hoy.getMonth();
  }
  isMinusThanToday(date: Date) {
    return date < new Date();
  }

  @Output() dates = new EventEmitter<{
    desde: Date | null;
    hasta: Date | null;
  }>();

  desde!: Date | null;
  hasta!: Date | null;
  setDays(date: Date) {
    if (!this.desde && !this.hasta) {
      this.desde = new Date(date);
    } else if (
      this.desde &&
      date < this.desde &&
      this.rangoDisponible(date, this.desde) //! En el rango disponible
    ) {
      this.hasta = new Date(this.desde);
      this.desde = new Date(date);
    } else if (
      this.desde &&
      date > this.desde &&
      this.rangoDisponible(this.desde, date) //! En el rango disponible
    ) {
      this.hasta = new Date(date);
    } else if (this.desde && date.getTime() == this.desde.getTime()) {
      this.desde = null;
      this.hasta = null;
    }
    this.dates.emit({ desde: this.desde, hasta: this.hasta });
  }

  compareDate(d: Date) {
    return (
      d.getTime() === this.desde?.getTime() ||
      d.getTime() === this.hasta?.getTime()
    );
  }

  betweenDate(d: Date) {
    return d < this.hasta! && d > this.desde!;
  }

  // @Output() selectedDay = new EventEmitter<{ desde: Date; hasta: Date }>();
  // sendDay() {
  //   if (this.desde && this.hasta)
  //     this.selectedDay.emit({ desde: this.desde, hasta: this.hasta });
  //   else throw new Error('Faltan parámetros');
  // }

  isPressed = false;

  press(event: any, d: Date) {
    if (event === 'start') {
      this.desde = d;
      this.isPressed = true;
    } else this.isPressed = false;
  }

  select(d: Date) {
    if (this.desde)
      if (
        this.isPressed &&
        this.rangoDisponible(this.desde, d) &&
        !this.isMinusThanToday(d)
      ) {
        if (this.desde < d) {
          this.hasta = d;
          this.dates.emit({ desde: this.desde, hasta: this.hasta });
        } else {
          this.hasta = this.desde;
          this.desde = d;
        }
      } else this.isPressed = false;
  }

  // -------------------------------------------------------------------------------->
  private readonly service = inject(ReservasService);
  reservas: ReservaI[] = [];
  en_espera: ReservaI[] = [];
  getReservas(hab: number) {
    this.service.getReservasHabitacion(hab).subscribe((data) => {
      this.reservas = data.aprobados;
      this.en_espera = data.en_espera;

      this.semanas.forEach((d) => {
        d.dias.forEach((dd) => {
          this.datesReservadas(dd);
        });
      });
    });
  }

  datesReservadas(dia: { dia: Date; enable: boolean; reserva: boolean }) {
    // Si alguna reserva coincide, disable el día
    dia.enable = !this.reservas.some(
      (r) => dia.dia >= new Date(r.desde) && dia.dia <= new Date(r.hasta)
    );
    dia.reserva = this.en_espera.some(
      (r) => dia.dia >= new Date(r.desde) && dia.dia <= new Date(r.hasta)
    );
  }

  rangoDisponible(desde: Date, hasta: Date): boolean {
    return !this.reservas.some((r) => {
      return (
        (desde >= new Date(r.desde) && desde <= new Date(r.hasta)) || // Caso 1: El inicio del rango está dentro de una reserva
        (hasta >= new Date(r.desde) && hasta <= new Date(r.hasta)) || // Caso 2: El final del rango está dentro de una reserva
        (desde <= new Date(r.desde) && hasta >= new Date(r.hasta)) // Caso 3: El rango completo envuelve una reserva
      );
    });
  }
  // -------------------------------------------------------------------------------->
}
