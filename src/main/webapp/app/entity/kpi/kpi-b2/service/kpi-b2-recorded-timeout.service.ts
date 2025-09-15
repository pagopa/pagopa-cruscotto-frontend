import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { KpiB2RecordedTimeout, KpiB2RecordedTimeoutRequest } from '../models/KpiB2RecordedTimeout';

type RestKpiB2RecordedTimeout = Omit<KpiB2RecordedTimeout, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB2RecordedTimeoutService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/pago-pa/recorded-timeout');
  }

  /**
   * recupera i dati sulle richieste aggregati per partner, stazione e metodo
   * @param req insieme dei parametri della query
   */
  find(req: KpiB2RecordedTimeoutRequest): Observable<KpiB2RecordedTimeout[]> {
    const options = createRequestOption(req);
    return this.http
      .get<RestKpiB2RecordedTimeout[]>(this.resourceUrl, { params: options })
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB2AnalyticData: RestKpiB2RecordedTimeout): KpiB2RecordedTimeout {
    return {
      ...restKpiB2AnalyticData,
      startDate: restKpiB2AnalyticData.startDate ? dayjs(restKpiB2AnalyticData.startDate, DATE_FORMAT) : null,
      endDate: restKpiB2AnalyticData.endDate ? dayjs(restKpiB2AnalyticData.endDate, DATE_FORMAT) : null,
    };
  }
}
