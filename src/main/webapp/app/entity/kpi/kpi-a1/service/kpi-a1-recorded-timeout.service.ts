import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA1AnalyticData } from '../models/KpiA1AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';
import { KpiA1RecordedTimeout, KpiA1RecordedTimeoutRequest } from '../models/KpiA1RecordedTimeout';
import { createRequestOption } from 'app/core/request/request-util';

type RestKpiA1RecordedTimeout = Omit<KpiA1RecordedTimeout, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA1RecordedTimeoutService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/api/kpi-a1-analytic-drilldown');
  }

  /**
   * Recupera i versamenti con codice tassonomico errato per il periodo relativo al dato analitico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiA1RecordedTimeout.
   */
  find(analyticDataId: number): Observable<KpiA1RecordedTimeout[]> {
    return this.http
      .get<RestKpiA1RecordedTimeout[]>(`${this.resourceUrl}/${analyticDataId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiA1AnalyticData: RestKpiA1RecordedTimeout): KpiA1RecordedTimeout {
    return {
      ...restKpiA1AnalyticData,
      startDate: restKpiA1AnalyticData.startDate ? dayjs(restKpiA1AnalyticData.startDate, DATE_FORMAT) : null,
      endDate: restKpiA1AnalyticData.endDate ? dayjs(restKpiA1AnalyticData.endDate, DATE_FORMAT) : null,
    };
  }
}
