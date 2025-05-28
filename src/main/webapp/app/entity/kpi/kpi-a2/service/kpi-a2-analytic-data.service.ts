import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA2AnalyticData } from '../models/KpiA2AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiA2AnalyticData = Omit<KpiA2AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: string | null;
  evaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA2AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/a2/module');
  }

  /**
   * Recupera i dati analitici KPI A2 per un modulo specifico.
   *
   * @param moduleId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiA2AnalyticData.
   */
  findByModuleId(moduleId: number): Observable<KpiA2AnalyticData[]> {
    return this.http
      .get<RestKpiA2AnalyticData[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiA2AnalyticData: RestKpiA2AnalyticData): KpiA2AnalyticData {
    return {
      ...restKpiA2AnalyticData,
      analysisDate: restKpiA2AnalyticData.analysisDate ? dayjs(restKpiA2AnalyticData.analysisDate, DATE_FORMAT) : null,
      evaluationDate: restKpiA2AnalyticData.evaluationDate ? dayjs(restKpiA2AnalyticData.evaluationDate, DATE_FORMAT) : null,
    };
  }
}
