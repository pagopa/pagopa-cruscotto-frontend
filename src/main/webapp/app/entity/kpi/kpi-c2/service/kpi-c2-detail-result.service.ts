import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiC2DetailResult } from '../models/kpi-c2-models';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiC2DetailResult = Omit<KpiC2DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC2DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/c2/module');
  }

  /**
   * Recupera i dettagli dei KPI C2 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiC2DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiC2DetailResult[]> {
    return this.http
      .get<RestKpiC2DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiC2DetailResult: RestKpiC2DetailResult): KpiC2DetailResult {
    return {
      ...restKpiC2DetailResult,
      analysisDate: restKpiC2DetailResult.analysisDate ? dayjs(restKpiC2DetailResult.analysisDate, DATE_FORMAT) : null,
      evaluationStartDate: restKpiC2DetailResult.evaluationStartDate ? dayjs(restKpiC2DetailResult.evaluationStartDate, DATE_FORMAT) : null,
      evaluationEndDate: restKpiC2DetailResult.evaluationEndDate ? dayjs(restKpiC2DetailResult.evaluationEndDate, DATE_FORMAT) : null,
    };
  }
}
