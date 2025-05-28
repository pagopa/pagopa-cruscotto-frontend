import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA1DetailResult } from '../models/KpiA1DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiA1DetailResult = Omit<KpiA1DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiA1DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/a1/module');
  }

  /**
   * Recupera i dettagli dei KPI A1 per un dato modulo.
   *
   * @param moduleId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiA1DetailResult.
   */
  findByModuleId(moduleId: number): Observable<KpiA1DetailResult[]> {
    return this.http
      .get<RestKpiA1DetailResult[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiA1DetailResult: RestKpiA1DetailResult): KpiA1DetailResult {
    return {
      ...restKpiA1DetailResult,
      analysisDate: restKpiA1DetailResult.analysisDate ? dayjs(restKpiA1DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiA1DetailResult.evaluationStartDate ? dayjs(restKpiA1DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiA1DetailResult.evaluationEndDate ? dayjs(restKpiA1DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
