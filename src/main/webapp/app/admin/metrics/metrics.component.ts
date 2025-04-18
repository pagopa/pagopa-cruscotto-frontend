import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import SharedModule from 'app/shared/shared.module';
import { MetricsService } from './metrics.service';
import { Metrics, Thread } from './metrics.model';
import { JvmMemoryComponent } from './blocks/jvm-memory/jvm-memory.component';
import { JvmThreadsComponent } from './blocks/jvm-threads/jvm-threads.component';
import { MetricsCacheComponent } from './blocks/metrics-cache/metrics-cache.component';
import { MetricsDatasourceComponent } from './blocks/metrics-datasource/metrics-datasource.component';
import { MetricsEndpointsRequestsComponent } from './blocks/metrics-endpoints-requests/metrics-endpoints-requests.component';
import { MetricsGarbageCollectorComponent } from './blocks/metrics-garbagecollector/metrics-garbagecollector.component';
import { MetricsRequestComponent } from './blocks/metrics-request/metrics-request.component';
import { MetricsSystemComponent } from './blocks/metrics-system/metrics-system.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,
    JvmMemoryComponent,
    JvmThreadsComponent,
    MetricsCacheComponent,
    MetricsDatasourceComponent,
    MetricsEndpointsRequestsComponent,
    MetricsGarbageCollectorComponent,
    MetricsRequestComponent,
    MetricsSystemComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    NgxSpinnerModule,
  ],
  styles: [ '.mat-card-metrics { min-height: 400px; }'],
})
export default class MetricsComponent implements OnInit {
  metrics = signal<Metrics | null>(null);
  threads = signal<Thread[] | null>(null);
  updatingMetrics = signal(true);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly metricsService = inject(MetricsService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.spinner.show('updatingMetrics').then(() => {
      this.updatingMetrics.set(true);
    });
    combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics.set(metrics.body);
      this.threads.set(threadDump.body ? threadDump.body.threads : null);
      this.spinner.hide('updatingMetrics').then(() => {
        this.updatingMetrics.set(false);
      });
      this.changeDetector.markForCheck();
    });
  }

  metricsKeyExistsAndObjectNotEmpty(key: keyof Metrics): boolean {
    return Boolean(this.metrics()?.[key] && JSON.stringify(this.metrics()?.[key]) !== '{}');
  }

  previousState(): void {
    window.history.back();
  }
}
