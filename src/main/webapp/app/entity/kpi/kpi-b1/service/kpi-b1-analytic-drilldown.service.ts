import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from '../../../../config/input.constants';
import { KpiB1AnalyticDrilldown } from '../models/KpiB1AnalyticDrilldown';

type RestKpiB1AnalyticDrilldown = Omit<KpiB1AnalyticDrilldown, 'dataDate'> & {
  loadTimestamp?: string | null;
  dataDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB1AnalyticDrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-b1-pagopa-data');
  }

  /**
   * recupera i dati sulle richieste aggregati per partner, stazione e metodo
   * @param kpiB1AnalyticDataId id del dato analitico di riferimento
   */
  find(kpiB1AnalyticDataId: number): Observable<KpiB1AnalyticDrilldown[]> {
    return this.http
      .get<RestKpiB1AnalyticDrilldown[]>(`${this.resourceUrl}/${kpiB1AnalyticDataId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB1AnalyticData: RestKpiB1AnalyticDrilldown): KpiB1AnalyticDrilldown {
    return {
      ...restKpiB1AnalyticData,
      dataDate: restKpiB1AnalyticData.dataDate ? dayjs(restKpiB1AnalyticData.dataDate, DATE_FORMAT) : null,
    };
  }
}
