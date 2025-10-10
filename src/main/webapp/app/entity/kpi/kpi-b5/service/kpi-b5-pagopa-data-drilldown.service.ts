import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IB5PagoPaDrilldown } from '../models/KpiB5AnalyticDrilldown';

type PagopaData = Omit<IB5PagoPaDrilldown, '' | ''> & {
  partnerFiscalCode?: string | null;
  stationCode?: string | number | null;
  spontaneousPayments?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class KpiB5PagopaDataDrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-b5-pagopa-data');
  }

  /**
   * NUOVO: recupera i record di drilldown per l'analyticDataId selezionato
   */
  findByAnalyticDataId(analyticDataId: number): Observable<IB5PagoPaDrilldown[]> {
    return this.http.get<PagopaData[]>(`${this.resourceUrl}/${analyticDataId}`).pipe(
      first(),
      map(res => res.map(item => this.convertFromServer(item))),
    );
  }

  private convertFromServer(p: PagopaData): IB5PagoPaDrilldown {
    return {
      partnerFiscalCode: p.partnerFiscalCode ?? null,
      partnerName: p.partnerFiscalCode ?? null,
      fiscalCode: p.fiscalCode ?? null,
      stationCode: p.stationCode != null ? String(p.stationCode) : null,
      spontaneousPayments: p.spontaneousPayments ?? null,
    };
  }
}
