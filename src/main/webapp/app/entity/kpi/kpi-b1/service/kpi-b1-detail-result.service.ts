import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB1DetailResult } from '../models/KpiB1DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB1DetailResult = Omit<KpiB1DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB1DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b1/module');
  }

  /**
   * Recupera i dettagli dei KPI B1 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB1DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB1DetailResult[]> {
    return this.http
      .get<RestKpiB1DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB1DetailResult: RestKpiB1DetailResult): KpiB1DetailResult {
    return {
      ...restKpiB1DetailResult,
      analysisDate: restKpiB1DetailResult.analysisDate ? dayjs(restKpiB1DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB1DetailResult.evaluationStartDate ? dayjs(restKpiB1DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB1DetailResult.evaluationEndDate ? dayjs(restKpiB1DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
