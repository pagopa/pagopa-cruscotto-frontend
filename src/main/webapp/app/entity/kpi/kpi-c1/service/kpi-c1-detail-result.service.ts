import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiC1DetailResult } from '../models/KpiC1DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiC1DetailResult = Omit<KpiC1DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC1DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/c1/module');
  }

  /**
   * Recupera i dettagli dei KPI C1 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiC1DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiC1DetailResult[]> {
    return this.http
      .get<RestKpiC1DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiC1DetailResult: RestKpiC1DetailResult): KpiC1DetailResult {
    return {
      ...restKpiC1DetailResult,
      analysisDate: restKpiC1DetailResult.analysisDate ? dayjs(restKpiC1DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiC1DetailResult.evaluationStartDate ? dayjs(restKpiC1DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiC1DetailResult.evaluationEndDate ? dayjs(restKpiC1DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}