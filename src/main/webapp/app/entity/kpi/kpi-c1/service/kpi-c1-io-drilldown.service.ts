import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IC1IODrilldown } from '../models/KpiC1AnalyticDrilldown';
import dayjs from 'dayjs/esm';

type IO = Omit<IC1IODrilldown, 'cfInstitution' | 'referenceDate'> & {
  referenceDate?: string | null;
  dataDate?: string | null;
  cfInstitution: string | null;
  cfPartner: string | null;
  positionsCount: number;
  messagesCount: number;
  percentage: number;
  meetsTolerance: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class KpiC1IODrilldownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-c1-io-drilldown');
  }

  /**
   * NUOVO: recupera i record di drilldown per l'analyticDataId selezionato
   */
  findByAnalyticDataId(analyticDataId: number): Observable<IC1IODrilldown[]> {
    console.log('analyticDataId: ', analyticDataId);
    return this.http.get<IO[]>(`${this.resourceUrl}/${analyticDataId}`).pipe(
      first(),
      map(res => res.map(item => this.convertFromServer(item))),
    );
  }

  private toDateSafe(v?: string | null): Date | null {
    if (!v) return null;
    const d = dayjs(v);
    return d.isValid() ? d.toDate() : null;
  }

  private convertFromServer(p: IO): IC1IODrilldown {
    return {
      ...p,
      referenceDate: this.toDateSafe(p.referenceDate),
      dataDate: this.toDateSafe(p.dataDate),
      cfInstitution: p.cfInstitution != null ? String(p.cfInstitution) : null,
      cfPartner: p.cfPartner != null ? String(p.cfPartner) : null,
      positionsCount: p.positionsCount ?? 0,
      messagesCount: p.messagesCount ?? 0,
      percentage: p.percentage ?? 0,
    };
  }
}
