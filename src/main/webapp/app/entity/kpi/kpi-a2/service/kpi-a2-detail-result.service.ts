import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA2DetailResult } from '../models/KpiA2DetailResult';
import { DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiA2DetailResult = Omit<KpiA2DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA2DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/a2/module');
  }

  /**
   * Recupera i dettagli dei KPI A2 per un dato modulo.
   *
   * @param moduleId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiA2DetailResult.
   */
  findByModuleId(moduleId: number): Observable<KpiA2DetailResult[]> {
    return this.http
      .get<RestKpiA2DetailResult[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiA2DetailResult: RestKpiA2DetailResult): KpiA2DetailResult {
    return {
      ...restKpiA2DetailResult,
      analysisDate: restKpiA2DetailResult.analysisDate ? dayjs(restKpiA2DetailResult.analysisDate, DATE_TIME_FORMAT_ISO) : null,
      evaluationStartDate: restKpiA2DetailResult.evaluationStartDate
        ? dayjs(restKpiA2DetailResult.evaluationStartDate, DATE_TIME_FORMAT_ISO)
        : null,
      evaluationEndDate: restKpiA2DetailResult.evaluationEndDate
        ? dayjs(restKpiA2DetailResult.evaluationEndDate, DATE_TIME_FORMAT_ISO)
        : null,
    };
  }
}
