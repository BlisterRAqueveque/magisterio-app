import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParcelaI } from '../models/parcelas';
import { catchError, map } from 'rxjs';
import { handleError } from '../tools/handle-error';

@Injectable({ providedIn: 'root' })
export class ParcelasService {
  private readonly http = inject(HttpClient);

  private readonly url = environment.url + 'parcelas/';

  getOne(id: number) {
    const direction = this.url + id;
    return this.http
      .get<{ ok: boolean; result: ParcelaI; msg: string }>(direction)
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }
}
