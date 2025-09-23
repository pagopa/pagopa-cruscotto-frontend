import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';
import { KpiB2RecordedTimeout } from '../models/KpiB2RecordedTimeout';

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
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-b2-analytic-drilldown');
  }

  /**
   * recupera i dati sulle richieste aggregati per partner, stazione e metodo
   * @param kpiB2AnalyticDataId id del dato analitico di riferimento
   */
  find(kpiB2AnalyticDataId: number): Observable<KpiB2RecordedTimeout[]> {
    return this.http
      .get<RestKpiB2RecordedTimeout[]>(`${this.resourceUrl}/${kpiB2AnalyticDataId}`)
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
