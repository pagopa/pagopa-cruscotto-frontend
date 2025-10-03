import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IB3PagoPaDrilldown } from '../models/KpiB3AnalyticDrilldown';
import dayjs from 'dayjs/esm';

type PagopaData = Omit<IB3PagoPaDrilldown, 'intervalStart' | 'intervalEnd'> & {
  partnerFiscalCode?: string | null;
  intervalStart?: string | null;
  intervalEnd?: string | null;
  stationCode?: string | number | null;
  standInCount?: number | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB3PagopaDataDrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-b3-pagopa-data');
  }

  /**
   * NUOVO: recupera i record di drilldown per l'analyticDataId selezionato
   */
  findByAnalyticDataId(analyticDataId: number): Observable<IB3PagoPaDrilldown[]> {
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

  private convertFromServer(p: PagopaData): IB3PagoPaDrilldown {
    return {
      partnerFiscalCode: p.partnerFiscalCode ?? null,
      intervalStart: this.toDateSafe(p.intervalStart),
      intervalEnd: this.toDateSafe(p.intervalEnd),
      stationCode: p.stationCode != null ? String(p.stationCode) : null,
      standInCount: p.standInCount ?? 0,
    };
  }
}
