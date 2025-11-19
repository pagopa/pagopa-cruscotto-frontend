import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB8DetailResult } from '../models/KpiB8DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB8DetailResult = Omit<KpiB8DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB8DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b8/module');
  }

  /**
   * Recupera i dettagli dei KPI B8 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB8DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB8DetailResult[]> {
    return this.http
      .get<RestKpiB8DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB8DetailResult: RestKpiB8DetailResult): KpiB8DetailResult {
    return {
      ...restKpiB8DetailResult,
      analysisDate: restKpiB8DetailResult.analysisDate ? dayjs(restKpiB8DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB8DetailResult.evaluationStartDate ? dayjs(restKpiB8DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB8DetailResult.evaluationEndDate ? dayjs(restKpiB8DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
