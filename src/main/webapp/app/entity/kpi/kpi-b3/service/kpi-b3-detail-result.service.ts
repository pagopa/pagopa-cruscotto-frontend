import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB3DetailResult } from '../models/KpiB3DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB3DetailResult = Omit<KpiB3DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB3DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b3/module');
  }

  /**
   * Recupera i dettagli dei KPI B3 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB3DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB3DetailResult[]> {
    return this.http
      .get<RestKpiB3DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB3DetailResult: RestKpiB3DetailResult): KpiB3DetailResult {
    return {
      ...restKpiB3DetailResult,
      analysisDate: restKpiB3DetailResult.analysisDate ? dayjs(restKpiB3DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB3DetailResult.evaluationStartDate ? dayjs(restKpiB3DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB3DetailResult.evaluationEndDate ? dayjs(restKpiB3DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
