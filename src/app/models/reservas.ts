import { HabitacionI } from './habitaciones';

export interface ReservaI {
  id: number;
  nombre: string;
  apellido: string;
  n_socio: string;
  tel: string;
  correo: string;

  desde: Date;
  hasta: Date;

  estado: number;

  // delegacion: DelegacionDto;
  habitacion: HabitacionI;
}
