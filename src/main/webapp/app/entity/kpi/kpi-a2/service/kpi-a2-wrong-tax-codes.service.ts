import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IWrongTaxCode } from '../models/KpiA2WrongTaxCodes';
import dayjs from 'dayjs/esm';

type RestWrongTaxCode = Omit<IWrongTaxCode, 'fromHour' | 'endHour'> & {
  fromHour?: string | null;
  endHour?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA2WrongTaxCodesService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/api/pago-pa/taxonomy-aggregate-position/drilldown');
  }

  /**
   * Recupera i dettagli dei KPI A2 per un dato modulo.
   *
   * @param cfPartner Codice fiscale del partner
   * @param day Giornata di riferimento (formato: yyyy-MM-dd)
   * @returns le righe presenti per la giornata selezionata che hanno un codice tassonomico errato
   */
  queryWrongTaxCodes(cfPartner: string, day: dayjs.Dayjs): Observable<IWrongTaxCode[]> {
    const params = new HttpParams().set('cfPartner', cfPartner).set('day', day.format(DATE_FORMAT));
    return this.http.get<RestWrongTaxCode[]>(this.resourceUrl, { params }).pipe(
      first(),
      map(res => res.map(item => this.convertFromServer(item))),
    );
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restWrongTaxCode: RestWrongTaxCode): IWrongTaxCode {
    return {
      ...restWrongTaxCode,
      fromHour: restWrongTaxCode ? dayjs(restWrongTaxCode.fromHour, DATE_TIME_FORMAT_ISO) : null,
      endHour: restWrongTaxCode ? dayjs(restWrongTaxCode.endHour, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
