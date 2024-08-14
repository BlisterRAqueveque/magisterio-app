import { CasaMutualI } from './casa-mutual';

export interface ParcelaI {
  id: number;
  nombre: string;
  fecha_creado: Date;
  activo: boolean;

  borrado_el: Date;

  casa_mutual: CasaMutualI;
}
