import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT } from '../../../../config/input.constants';
import { KpiC2AnalyticData } from '../models/kpi-c2-models';

type RestKpiC2AnalyticData = Omit<KpiC2AnalyticData, 'analysisDate' | 'evaluationDate'> & {
  analysisDate?: string | null;
  evaluationDate?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC2AnalyticDataService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/api/kpi-C2/analytic-data');
  }

  /**
   * Recupera i dati analitici KPI C2 per un modulo specifico.
   *
   * @param detailResultId ID del modulo.
   * @returns Observable con l'array dei risultati di tipo KpiC2AnalyticData.
   */
  findByDetailResultId(detailResultId: number): Observable<KpiC2AnalyticData[]> {
    return this.http
      .get<RestKpiC2AnalyticData[]>(`${this.resourceUrl}/${detailResultId}`)
      .pipe(map(res => res.map(item => this.convertFromServer(item))));
  }

  /**
   * Converte le date dal server al formato richiesto dal client.
   */
  private convertFromServer(restKpiC2AnalyticData: RestKpiC2AnalyticData): KpiC2AnalyticData {
    return {
      ...restKpiC2AnalyticData,
      analysisDate: restKpiC2AnalyticData.analysisDate ? dayjs(restKpiC2AnalyticData.analysisDate, DATE_FORMAT) : null,
    };
  }
}
