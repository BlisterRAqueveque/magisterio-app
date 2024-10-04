import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HorarioI } from '../models/horarios';
import { handleError } from '../tools/handle-error';

@Injectable({ providedIn: 'root' })
export class HorariosService {
  private readonly http = inject(HttpClient);

  private readonly url = environment.url + 'horarios/';

  getAll(params?: HttpParams) {
    const direction = this.url;
    return this.http
      .get<{
        ok: boolean;
        result: { result: HorarioI[]; count: number };
        msg: string;
      }>(direction, {
        params,
      })
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }
}
