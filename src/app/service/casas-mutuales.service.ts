import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CasaMutualI } from '../models/casa-mutual';
import { catchError, map } from 'rxjs';
import { handleError } from '../tools/handle-error';

@Injectable({ providedIn: 'root' })
export class CasasMutualesService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.url + 'casas-mutuales/';

  getCasasMutualesAndHabitaciones() {
    const direction = this.url + 'get-all/habitaciones'
    return this.http
      .get<{ ok: boolean; result: CasaMutualI[]; msg: string }>(direction)
      .pipe(
        catchError((e) => handleError(e)),
        map((data) => data.result)
      );
  }

  getReservasHabitacion() {}
}
