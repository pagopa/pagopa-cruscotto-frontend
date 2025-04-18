import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [ '.mat-mdc-progress-bar { --mdc-linear-progress-track-height: 24px; --mdc-linear-progress-active-indicator-height: 24px; --mdc-linear-progress-track-color: #e9ecef; --mdc-linear-progress-active-indicator-color: #477ded}'],
  imports: [SharedModule, MatProgressBarModule],
})
export class MetricsRequestComponent {
  /**
   * object containing http request related metrics
   */
  requestMetrics = input<HttpServerRequests>();

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();

  filterNaN = (n: number): number => filterNaN(n);
}
