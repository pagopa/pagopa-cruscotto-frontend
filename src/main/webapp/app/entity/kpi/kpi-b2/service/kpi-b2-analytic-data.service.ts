import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB2AnalyticData } from '../models/KpiB2AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_TIME_FORMAT_ISO } from '../../../../config/input.constants';

type RestKpiB2AnalyticData = Omit<KpiB2AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: string | null;
  evaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB2AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b2/module');
  }

  /**
   * Recupera i dati analitici KPI B2 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB2AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB2AnalyticData[]> {
    return this.http
      .get<RestKpiB2AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB2AnalyticData: RestKpiB2AnalyticData): KpiB2AnalyticData {
    return {
      ...restKpiB2AnalyticData,
      analysisDate: restKpiB2AnalyticData.analysisDate ? dayjs(restKpiB2AnalyticData.analysisDate, DATE_TIME_FORMAT_ISO) : null,
      evaluationDate: restKpiB2AnalyticData.evaluationDate ? dayjs(restKpiB2AnalyticData.evaluationDate, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
