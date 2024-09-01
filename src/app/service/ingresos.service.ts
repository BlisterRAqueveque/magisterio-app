import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IngresoParcelaI } from '../models/ingreso-parcela';
import { catchError, map } from 'rxjs';
import { handleError } from '../tools/handle-error';

@Injectable({
  providedIn: 'root',
})
export class IngresosService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.url + 'ingreso-parcelas/';

  insert(ingreso: Partial<IngresoParcelaI>) {
    return this.http
      .post<{ ok: true; result: IngresoParcelaI; msg: string }>(
        this.url,
        ingreso
      )
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }

  update(id: number, ingreso: Partial<IngresoParcelaI>) {
    const direction = this.url + id;
    return this.http
      .put<{ ok: true; result: IngresoParcelaI; msg: string }>(
        direction,
        ingreso
      )
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }

  checkStatus(id: number) {
    const direction = this.url + 'entity/status/' + id;
    return this.http
      .get<{ ok: boolean; result: number; msg: string }>(direction)
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }
}
