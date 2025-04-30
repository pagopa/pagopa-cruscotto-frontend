import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Metrics, ThreadDump } from './metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  getMetrics(): Observable<HttpResponse<Metrics>> {
    return this.http.get<Metrics>(this.applicationConfigService.getEndpointFor('management/jhimetrics'), { observe: 'response' });
  }

  threadDump(): Observable<HttpResponse<ThreadDump>> {
    return this.http.get<ThreadDump>(this.applicationConfigService.getEndpointFor('management/threaddump'), { observe: 'response' });
  }
}
