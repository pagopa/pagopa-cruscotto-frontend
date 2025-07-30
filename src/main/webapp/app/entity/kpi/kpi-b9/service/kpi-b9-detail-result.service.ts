import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB9DetailResult } from '../models/KpiB9DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB9DetailResult = Omit<KpiB9DetailResult, 'dtAnalisysDate' | 'dtEvaluationStartDate' | 'dtEvaluationEndDate'> & {
  analisysDate?: string | null;
  ealuationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB9DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b9/module');
  }

  /**
   * Recupera i dettagli dei KPI B9 per un dato modulo.
   *
   * @param moduleId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB9DetailResult.
   */
  findByModuleId(moduleId: number): Observable<KpiB9DetailResult[]> {
    return this.http
      .get<RestKpiB9DetailResult[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB9DetailResult: RestKpiB9DetailResult): KpiB9DetailResult {
    return {
      ...restKpiB9DetailResult,
      analysisDate: restKpiB9DetailResult.analysisDate ? dayjs(restKpiB9DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiB9DetailResult.evaluationStartDate ? dayjs(restKpiB9DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiB9DetailResult.evaluationEndDate ? dayjs(restKpiB9DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
