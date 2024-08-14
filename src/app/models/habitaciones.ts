import { CasaMutualI } from './casa-mutual';
import { ReservaI } from './reservas';

export interface HabitacionI {
  id: number;
  nombre: string;
  servicios: string[];
  borrado_el: Date;
  activo: boolean;
  fecha_creado: Date;

  casa_mutual: CasaMutualI;

  reservas: ReservaI[];
}
