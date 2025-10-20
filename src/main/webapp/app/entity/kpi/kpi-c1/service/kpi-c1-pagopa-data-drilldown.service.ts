import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IC1PagoPaDrilldown } from '../models/KpiC1AnalyticDrilldown';
import dayjs from 'dayjs/esm';

type PagopaData = Omit<IC1PagoPaDrilldown, 'institutionFiscalCode' | 'analysisDate'> & {
  analysisDate?: string | null;
  dataDate?: string | null;
  institutionFiscalCode: string | null;
  positionsCount: number;
  messagesCount: number;
  percentageMessages: number;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC1PagopaDataDrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-c1-pagopa-data');
  }

  /**
   * NUOVO: recupera i record di drilldown per l'analyticDataId selezionato
   */
  findByAnalyticDataId(analyticDataId: number): Observable<IC1PagoPaDrilldown[]> {
    return this.http.get<PagopaData[]>(`${this.resourceUrl}/${analyticDataId}`).pipe(
      first(),
      map(res => res.map(item => this.convertFromServer(item))),
    );
  }

  private toDateSafe(v?: string | null): Date | null {
    if (!v) return null;
    const d = dayjs(v);
    return d.isValid() ? d.toDate() : null;
  }

  private convertFromServer(p: PagopaData): IC1PagoPaDrilldown {
    return {
      ...p,
      analysisDate: this.toDateSafe(p.analysisDate),
      dataDate: this.toDateSafe(p.dataDate),
      institutionFiscalCode: p.institutionFiscalCode != null ? String(p.institutionFiscalCode) : null,
      positionsCount: p.positionsCount ?? 0,
      messagesCount: p.messagesCount ?? 0,
      percentageMessages: p.percentageMessages ?? 0,
    };
  }
}
