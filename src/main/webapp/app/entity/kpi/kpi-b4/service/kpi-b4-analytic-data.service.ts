import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB4AnalyticData } from '../models/KpiB4AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiB4AnalyticData = Omit<KpiB4AnalyticData, 'analysisDate' | 'dataDate'> & {
  analysisDate?: dayjs.Dayjs | null;
  dataDate?: dayjs.Dayjs | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB4AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/b4/module');
  }

  /**
   * Recupera i dati analitici KPI B4 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiB4AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiB4AnalyticData[]> {
    return this.http
      .get<RestKpiB4AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiB4AnalyticData: RestKpiB4AnalyticData): KpiB4AnalyticData {
    return {
      ...restKpiB4AnalyticData,
      analysisDate: restKpiB4AnalyticData.analysisDate ? dayjs(restKpiB4AnalyticData.analysisDate, DATE_FORMAT) : null,
      dataDate: restKpiB4AnalyticData.dataDate ? dayjs(restKpiB4AnalyticData.dataDate, DATE_FORMAT) : null,
    };
  }
}