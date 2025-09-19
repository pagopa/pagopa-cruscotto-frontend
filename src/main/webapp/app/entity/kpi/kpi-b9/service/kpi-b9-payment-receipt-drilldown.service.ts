import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import dayjs, { Dayjs } from 'dayjs/esm';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';

export interface B9DrilldownRowRest {
  startTime?: string | null;
  endTime?: string | null;
  totRes?: number | null;
  resKo?: number | null;
}
export interface B9DrilldownRow {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  totRes: number | null;
  resKo: number | null;
}

@Injectable({ providedIn: 'root' })
export class KpiB9PaymentReceiptDrilldownService {
  private http = inject(HttpClient);
  private app  = inject(ApplicationConfigService);

  private resourceUrl = this.app.getEndpointFor('/api/kpi-b9/drilldown/instance');

  find(instanceId: number, stationId: number, evaluationDate: Dayjs) {
    const url = `${this.resourceUrl}/${instanceId}/station/${stationId}`;
    const params = new HttpParams().set('evaluationDate', evaluationDate.format(DATE_FORMAT));

    return this.http.get<B9DrilldownRowRest[]>(url, { params }).pipe(
      map(rows =>
        (rows ?? []).map(r => ({
          startTime: r.startTime ? dayjs(r.startTime, DATE_TIME_FORMAT_ISO) : null,
          endTime:  r.endTime  ? dayjs(r.endTime,  DATE_TIME_FORMAT_ISO) : null,
          totRes:   r.totRes ?? null,
          resKo:    r.resKo ?? null,
        }))
      )
    );
  }
}
