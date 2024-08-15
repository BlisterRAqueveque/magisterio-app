import { throwError } from 'rxjs';

/** @description FX para el manejo de errores de las peticiones */
export const handleError = (error: any) => {
  console.error(error);
  return throwError(() => error);
};
