import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservaI } from '../models/reservas';
import { handleError } from '../tools/handle-error';

interface ResponseI<T = any> {
  ok: boolean;
  result: T;
  msg: string;
  puedeReservar: T;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.url + 'reservas/';

  getReservasHabitacion(id: number) {
    const direction = this.url + 'room/' + id;
    return this.http.get<any>(direction).pipe(
      catchError((e) => handleError(e)),
      map(
        (data) =>
          data.result as { aprobados: ReservaI[]; en_espera: ReservaI[] }
      )
    );
  }

  insert(data: Partial<ReservaI>) {
    return this.http.post<ResponseI<ReservaI[]>>(this.url, data).pipe(
      catchError((e) => handleError(e)),
      map((data) => data.result)
    );
  }

  getBySocioNumber(params: HttpParams) {
    const dir = this.url + 'reserva/nSocio';
    return this.http.get<ResponseI<boolean>>(dir, { params }).pipe(
      catchError((e) => handleError(e)),
      map((data) => data.puedeReservar)
    );
  }
}
