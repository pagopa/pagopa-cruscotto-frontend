import { Component, input } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { JvmMetrics } from 'app/admin/metrics/metrics.model';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.component.html',
  styles: [ '.mat-mdc-progress-bar { --mdc-linear-progress-track-height: 24px; --mdc-linear-progress-active-indicator-height: 24px; --mdc-linear-progress-track-color: #e9ecef; --mdc-linear-progress-active-indicator-color: #477ded}'],
  imports: [SharedModule, MatProgressBarModule],
})
export class JvmMemoryComponent {
  /**
   * object containing all jvm memory metrics
   */
  jvmMemoryMetrics = input<Record<string, JvmMetrics>>();

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();
}
