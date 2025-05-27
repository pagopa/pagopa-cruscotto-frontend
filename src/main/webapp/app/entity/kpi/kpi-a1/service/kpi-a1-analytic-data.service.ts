import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA1AnalyticData } from '../models/KpiA1AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_TIME_FORMAT_ISO } from '../../../../config/input.constants';

type RestKpiA1AnalyticData = Omit<KpiA1AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: string | null;
  evaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA1AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/a1/module');
  }

  /**
   * Recupera i dati analitici KPI A1 per un modulo specifico.
   *
   * @param moduleId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiA1AnalyticData.
   */
  findByModuleId(moduleId: number): Observable<KpiA1AnalyticData[]> {
    return this.http
      .get<RestKpiA1AnalyticData[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiA1AnalyticData: RestKpiA1AnalyticData): KpiA1AnalyticData {
    return {
      ...restKpiA1AnalyticData,
      analysisDate: restKpiA1AnalyticData.analysisDate ? dayjs(restKpiA1AnalyticData.analysisDate, DATE_TIME_FORMAT_ISO) : null,
      evaluationDate: restKpiA1AnalyticData.evaluationDate ? dayjs(restKpiA1AnalyticData.evaluationDate, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
