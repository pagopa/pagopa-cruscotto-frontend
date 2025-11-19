import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB5AnalyticData } from '../models/KpiB5AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB5AnalyticData = Omit<KpiB5AnalyticData, 'analysisDate'> & {
  analysisDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB5AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b5/module');
  }

  /**
   * Recupera i dati analitici KPI B5 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB5AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB5AnalyticData[]> {
    return this.http
      .get<RestKpiB5AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB5AnalyticData: RestKpiB5AnalyticData): KpiB5AnalyticData {
    return {
      ...restKpiB5AnalyticData,
      analysisDate: restKpiB5AnalyticData.analysisDate ? dayjs(restKpiB5AnalyticData.analysisDate, DATE_FORMAT) : null,
    };
  }
}
