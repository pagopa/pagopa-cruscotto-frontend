import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB6AnalyticData } from '../models/KpiB6AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB6AnalyticData = Omit<KpiB6AnalyticData, 'analysisDate' | 'dataDate'> & {
  analysisDate?: dayjs.Dayjs | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB6AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b4/module');
  }

  /**
   * Recupera i dati analitici KPI B6 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB6AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB6AnalyticData[]> {
    return this.http
      .get<RestKpiB6AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB6AnalyticData: RestKpiB6AnalyticData): KpiB6AnalyticData {
    return {
      ...restKpiB6AnalyticData,
      analysisDate: restKpiB6AnalyticData.analysisDate ? dayjs(restKpiB6AnalyticData.analysisDate, DATE_FORMAT) : null,
    };
  }
}
