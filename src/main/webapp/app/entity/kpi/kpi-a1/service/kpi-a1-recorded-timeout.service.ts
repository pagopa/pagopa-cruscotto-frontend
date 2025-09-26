import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_TIME_FORMAT_ISO } from '../../../../config/input.constants';
import { KpiA1RecordedTimeout } from '../models/KpiA1RecordedTimeout';

type RestKpiA1RecordedTimeout = Omit<KpiA1RecordedTimeout, 'fromHour' | 'toHour'> & {
  fromHour?: string | null;
  toHour?: string | null;
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
      fromHour: restKpiA1AnalyticData.fromHour ? dayjs(restKpiA1AnalyticData.fromHour, DATE_TIME_FORMAT_ISO) : null,
      toHour: restKpiA1AnalyticData.toHour ? dayjs(restKpiA1AnalyticData.toHour, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
