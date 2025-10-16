import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB4DetailResult } from '../models/KpiB4DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB4DetailResult = Omit<KpiB4DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB4DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b4/module');
  }

  /**
   * Recupera i dettagli dei KPI B4 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB4DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB4DetailResult[]> {
    return this.http
      .get<RestKpiB4DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB4DetailResult: RestKpiB4DetailResult): KpiB4DetailResult {
    return {
      ...restKpiB4DetailResult,
      analysisDate: restKpiB4DetailResult.analysisDate ? dayjs(restKpiB4DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB4DetailResult.evaluationStartDate ? dayjs(restKpiB4DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB4DetailResult.evaluationEndDate ? dayjs(restKpiB4DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}