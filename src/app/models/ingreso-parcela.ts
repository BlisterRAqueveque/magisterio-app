import { ParcelaI } from './parcelas';

export interface IngresoParcelaI {
  id: number;

  n_socio: string;
  nombre: string;
  nombre_salida: string;

  ingreso_fecha: Date;
  salida_fecha: Date;

  parcela: Partial<ParcelaI>;
}
