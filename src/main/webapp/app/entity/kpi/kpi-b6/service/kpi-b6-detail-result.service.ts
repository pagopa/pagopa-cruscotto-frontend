import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB6DetailResult } from '../models/KpiB6DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB6DetailResult = Omit<KpiB6DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB6DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/B6/module');
  }

  /**
   * Recupera i dettagli dei KPI B6 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB6DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB6DetailResult[]> {
    return this.http
      .get<RestKpiB6DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB6DetailResult: RestKpiB6DetailResult): KpiB6DetailResult {
    return {
      ...restKpiB6DetailResult,
      analysisDate: restKpiB6DetailResult.analysisDate ? dayjs(restKpiB6DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB6DetailResult.evaluationStartDate ? dayjs(restKpiB6DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB6DetailResult.evaluationEndDate ? dayjs(restKpiB6DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
