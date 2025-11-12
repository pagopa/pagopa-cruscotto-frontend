import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB5DetailResult } from '../models/KpiB5DetailResult';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

type RestKpiB5DetailResult = Omit<KpiB5DetailResult, 'analysisDate'> & {
  analysisDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB5DetailResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-detail-results/b5/module');
  }

  /**
   * Recupera i dettagli dei KPI B5 per un dato modulo.
   *
   * @param resultId ID del modulo
   * @returns Observable con l'array dei risultati di tipo KpiB5DetailResult.
   */
  findByResultId(resultId: number): Observable<KpiB5DetailResult[]> {
    return this.http
      .get<RestKpiB5DetailResult[]>(`${this.resourceUrl}/${resultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte il formato delle date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB5DetailResult: RestKpiB5DetailResult): KpiB5DetailResult {
    return {
      ...restKpiB5DetailResult,
      analysisDate: restKpiB5DetailResult.analysisDate ? dayjs(restKpiB5DetailResult.analysisDate, DATE_FORMAT) : null,
    };
  }
}
