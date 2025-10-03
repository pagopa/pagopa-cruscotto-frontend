import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB3AnalyticData } from '../models/KpiB3AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB3AnalyticData = Omit<KpiB3AnalyticData, 'analysisDate' | 'eventTimestamp'> & {
  analysisDate?: string | null;
  eventTimestamp?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB3AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b3/module');
  }

  /**
   * Recupera i dati analitici KPI B3 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB3AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB3AnalyticData[]> {
    return this.http
      .get<RestKpiB3AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB3AnalyticData: RestKpiB3AnalyticData): KpiB3AnalyticData {
    return {
      ...restKpiB3AnalyticData,
      analysisDate: restKpiB3AnalyticData.analysisDate ? dayjs(restKpiB3AnalyticData.analysisDate, DATE_FORMAT) : null,
      eventTimestamp: restKpiB3AnalyticData.eventTimestamp ? dayjs(restKpiB3AnalyticData.eventTimestamp, DATE_FORMAT) : null,
    };
  }
}