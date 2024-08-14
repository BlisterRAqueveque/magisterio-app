import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewChild,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeftSolid,
  heroChevronRightSolid,
} from '@ng-icons/heroicons/solid';
import { heroHomeModernMini } from '@ng-icons/heroicons/mini';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { CardComponent } from '../components/card/card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SelectComponent } from '../components/select/select.component';
import { ModalComponent } from '../components/modal/modal.component';
import { CasasMutualesService } from '../service/casas-mutuales.service';
import { CasaMutualI } from '../models/casa-mutual';
import { HabitacionI } from '../models/habitaciones';
import { ReservasService } from '../service/reservas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    NavbarComponent,
    CardComponent,
    FooterComponent,
    NgIcon,
    CalendarComponent,
    SelectComponent,
    ModalComponent,
  ],
  providers: [
    provideIcons({
      heroChevronLeftSolid,
      heroChevronRightSolid,
      heroHomeModernMini,
    }),
  ],
})
export class HomePage {
  visible = false;
  isScroll = false;

  /** @description Guarda el height de los elementos sticky */
  height = 0;
  onScroll(event: CustomEvent) {
    if (event.detail.scrollTop < 1) {
      this.isScroll = false;
      this.height = 0;
    } else {
      this.isScroll = true;

      //* Obtenemos los elementos
      const header = document.querySelector('.header');
      const search = document.querySelector('#search');
      //* Calculamos el height
      this.height = header?.clientHeight! + search?.clientHeight! / 2;
    }
  }

  casas_mutuales: CasaMutualI[] = [];

  /** @description Valor del distrito seleccionado */
  casa_mutual!: CasaMutualI | null;

  habitaciones: HabitacionI[] = [];
  habitacion!: HabitacionI | null;

  servicios: string[] = [];

  //! 13/08/2024
  private readonly casaService = inject(CasasMutualesService);

  ngOnInit() {
    this.casaService.getCasasMutualesAndHabitaciones().subscribe((data) => {
      this.casas_mutuales = data;
    });
  }

  setHabitaciones(casa_mutual?: CasaMutualI) {
    if (casa_mutual) {
      this.resetValues();
      this.habitaciones = casa_mutual.habitaciones;
    }
  }

  private readonly reservaService = inject(ReservasService);

  setServicios(habitacion?: HabitacionI) {
    if (habitacion) {
      this.servicios = habitacion.servicios;
      this.reservaService
        .getReservasHabitacion(habitacion.id)
        .subscribe((data) => {});
    }
  }

  desde!: Date | null;
  hasta!: Date | null;
  getDate(dates: { desde: Date | null; hasta: Date | null }) {
    this.desde = dates.desde;
    this.hasta = dates.hasta;
  }

  resetValues() {
    this.habitaciones = [];
    this.habitacion = null;
    this.hab.deleteValue();
    this.servicios = [];
  }

  @ViewChild('casas') casas!: SelectComponent;
  @ViewChild('hab') hab!: SelectComponent;
  @ViewChild('calendar') calendar!: CalendarComponent;

  clear() {
    this.casa_mutual = null;
    this.desde = null;
    this.hasta = null;
    this.casas.deleteValue();
    this.calendar.desde = null;
    this.calendar.hasta = null;
    this.resetValues();
  }
}
