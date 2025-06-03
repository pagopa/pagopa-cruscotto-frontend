import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';
import { KpiB9AnalyticData } from '../models/KpiB9AnalyticData';

type RestKpiB9AnalyticData = Omit<KpiB9AnalyticData, 'dtAnalisysDate' | 'dtEvaluationDate'> & {
  dtAnalisysDate?: string | null;
  dtEvaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB9AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b9/module');
  }

  /**
   * Recupera i dati analitici KPI B9 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB9AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB9AnalyticData[]> {
    return this.http
      .get<RestKpiB9AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB9AnalyticData: RestKpiB9AnalyticData): KpiB9AnalyticData {
    return {
      ...restKpiB9AnalyticData,
      dtAnalisysDate: restKpiB9AnalyticData.dtAnalisysDate ? dayjs(restKpiB9AnalyticData.dtAnalisysDate, DATE_FORMAT) : null,
      dtEvaluationDate: restKpiB9AnalyticData.dtEvaluationDate ? dayjs(restKpiB9AnalyticData.dtEvaluationDate, DATE_FORMAT) : null,
    };
  }
}
