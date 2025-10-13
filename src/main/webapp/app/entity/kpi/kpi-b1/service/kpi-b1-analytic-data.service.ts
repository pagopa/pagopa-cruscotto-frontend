import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB1AnalyticData } from '../models/KpiB1AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB1AnalyticData = Omit<KpiB1AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: string | null;
  evaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB1AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b1/module');
  }

  /**
   * Recupera i dati analitici KPI B1 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB1AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB1AnalyticData[]> {
    return this.http
      .get<RestKpiB1AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB1AnalyticData: RestKpiB1AnalyticData): KpiB1AnalyticData {
    return {
      ...restKpiB1AnalyticData,
      analysisDate: restKpiB1AnalyticData.analysisDate ? dayjs(restKpiB1AnalyticData.analysisDate, DATE_FORMAT) : null,
      evaluationDate: restKpiB1AnalyticData.evaluationDate ? dayjs(restKpiB1AnalyticData.evaluationDate, DATE_FORMAT) : null,
    };
  }
}
