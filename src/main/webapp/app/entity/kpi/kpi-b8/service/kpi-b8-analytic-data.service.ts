import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB8AnalyticData } from '../models/KpiB8AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB8AnalyticData = Omit<KpiB8AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: dayjs.Dayjs | null;
  evaluationDate?: dayjs.Dayjs | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB8AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b8/module');
  }

  /**
   * Recupera i dati analitici KPI B8 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB8AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB8AnalyticData[]> {
    return this.http
      .get<RestKpiB8AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB8AnalyticData: RestKpiB8AnalyticData): KpiB8AnalyticData {
    return {
      ...restKpiB8AnalyticData,
      analysisDate: restKpiB8AnalyticData.analysisDate ? dayjs(restKpiB8AnalyticData.analysisDate, DATE_FORMAT) : null,
      evaluationDate: restKpiB8AnalyticData.evaluationDate ? dayjs(restKpiB8AnalyticData.evaluationDate, DATE_FORMAT) : null,
    };
  }
}
