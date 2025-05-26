import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB2DetailResult } from '../models/KpiB2DetailResult';
import { DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB2DetailResult = Omit<KpiB2DetailResult, 'analysisDate' | 'evaluationStartDate' | 'evaluationEndDate'> & {
  analysisDate?: string | null;
  evaluationStartDate?: string | null;
  evaluationEndDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB2DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b2/module');
  }

  /**
   * Recupera i dettagli dei KPI B2 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB2DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB2DetailResult[]> {
    return this.http
      .get<RestKpiB2DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB2DetailResult: RestKpiB2DetailResult): KpiB2DetailResult {
    return {
      ...restKpiB2DetailResult,
      analysisDate: restKpiB2DetailResult.analysisDate ? dayjs(restKpiB2DetailResult.analysisDate, DATE_TIME_FORMAT_ISO) : null,
      evaluationStartDate: restKpiB2DetailResult.evaluationStartDate
        ? dayjs(restKpiB2DetailResult.evaluationStartDate, DATE_TIME_FORMAT_ISO)
        : null,
      evaluationEndDate: restKpiB2DetailResult.evaluationEndDate
        ? dayjs(restKpiB2DetailResult.evaluationEndDate, DATE_TIME_FORMAT_ISO)
        : null,
    };
  }
}
