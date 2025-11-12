import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IB8PagoPaDrilldown } from '../models/KpiB8AnalyticDrilldown';
import dayjs from 'dayjs/esm';

type PagopaData = Omit<IB8PagoPaDrilldown, 'partnerFiscalCode' | 'dataDate'> & {
  partnerFiscalCode?: string | null;
  dataDate?: string | null;
  stationCode: string | null;
  fiscalCode: string | null;
  api: string | null;
  totalRequests: number;
  okRequests: number;
  koRequests: number;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB8PagopaDataDrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-b8-pagopa-data');
  }

  /**
   * NUOVO: recupera i record di drilldown per l'analyticDataId selezionato
   */
  findByAnalyticDataId(analyticDataId: number): Observable<IB8PagoPaDrilldown[]> {
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

  private convertFromServer(p: PagopaData): IB8PagoPaDrilldown {
    return {
      partnerId: p.partnerId ?? null,
      partnerName: p.partnerName ?? null,
      partnerFiscalCode: p.partnerFiscalCode ?? null,
      dataDate: this.toDateSafe(p.dataDate),
      stationCode: p.stationCode != null ? String(p.stationCode) : null,
      fiscalCode: p.fiscalCode != null ? String(p.fiscalCode) : null,
      api: p.api != null ? String(p.api) : null,
      totalRequests: p.totalRequests ?? 0,
      okRequests: p.okRequests ?? 0,
      koRequests: p.koRequests ?? 0,
    };
  }
}
