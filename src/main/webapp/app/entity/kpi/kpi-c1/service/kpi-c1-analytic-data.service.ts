import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiC1AnalyticData } from '../models/KpiC1AnalyticData';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';

type RestKpiC1AnalyticData = Omit<KpiC1AnalyticData, 'analysisDate' | 'dataDate'> & {
  analysisDate?: dayjs.Dayjs | null;
  dataDate?: dayjs.Dayjs | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC1AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-analytic-data/c1/module');
  }

  /**
   * Recupera i dati analitici KPI C1 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiC1AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiC1AnalyticData[]> {
    return this.http
      .get<RestKpiC1AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiC1AnalyticData: RestKpiC1AnalyticData): KpiC1AnalyticData {
    return {
      ...restKpiC1AnalyticData,
      analysisDate: restKpiC1AnalyticData.analysisDate ? dayjs(restKpiC1AnalyticData.analysisDate, DATE_FORMAT) : null,
      dataDate: restKpiC1AnalyticData.dataDate ? dayjs(restKpiC1AnalyticData.dataDate, DATE_FORMAT) : null,
    };
  }
}