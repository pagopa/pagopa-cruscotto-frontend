import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { KpiC2AnalyticDrillDown } from '../models/kpi-c2-models';

type RestKpiC2AnalyticDrillDown = Omit<KpiC2AnalyticDrillDown, 'fromHour' | 'endHour'> & {
  fromHour?: string | null;
  endHour?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC2AnalyticDrillDownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-c2-pagopa-data');
  }

  /**
   * recupera i dati sulle richieste aggregati per partner, stazione e metodo
   * @param kpiB2AnalyticDataId id del dato analitico di riferimento
   */
  find(kpiB2AnalyticDataId: number): Observable<KpiC2AnalyticDrillDown[]> {
    return this.http
      .get<RestKpiC2AnalyticDrillDown[]>(`${this.resourceUrl}/${kpiB2AnalyticDataId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB2AnalyticData: RestKpiC2AnalyticDrillDown): KpiC2AnalyticDrillDown {
    return {
      ...restKpiB2AnalyticData,
      // fromHour: restKpiB2AnalyticData.fromHour ? dayjs(restKpiB2AnalyticData.fromHour, DATE_TIME_FORMAT_ISO) : null,
      // endHour: restKpiB2AnalyticData.endHour ? dayjs(restKpiB2AnalyticData.endHour, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
