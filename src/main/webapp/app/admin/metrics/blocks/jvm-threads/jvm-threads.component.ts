import { Component, computed, inject, input } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { Thread, ThreadState } from 'app/admin/metrics/metrics.model';
import { MetricsModalThreadsComponent } from '../metrics-modal-threads/metrics-modal-threads.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'jhi-jvm-threads',
  templateUrl: './jvm-threads.component.html',
  styleUrl: './jvm-threads.component.scss',
  imports: [SharedModule, MatProgressBarModule, MatDialogModule, MatButton, MatIcon],
})
export class JvmThreadsComponent {
  threads = input<Thread[] | null>();
  readonly dialog = inject(MatDialog);

  threadStats = computed(() => {
    const stats = {
      threadDumpAll: 0,
      threadDumpRunnable: 0,
      threadDumpTimedWaiting: 0,
      threadDumpWaiting: 0,
      threadDumpBlocked: 0,
    };

    this.threads()?.forEach(thread => {
      if (thread.threadState === ThreadState.Runnable) {
        stats.threadDumpRunnable += 1;
      } else if (thread.threadState === ThreadState.Waiting) {
        stats.threadDumpWaiting += 1;
      } else if (thread.threadState === ThreadState.TimedWaiting) {
        stats.threadDumpTimedWaiting += 1;
      } else if (thread.threadState === ThreadState.Blocked) {
        stats.threadDumpBlocked += 1;
      }
    });

    stats.threadDumpAll = stats.threadDumpRunnable + stats.threadDumpWaiting + stats.threadDumpTimedWaiting + stats.threadDumpBlocked;

    return stats;
  });

  open(): void {
    this.dialog.open(MetricsModalThreadsComponent, {
      disableClose: true,
      width: '800px',
      maxWidth: '800px',
      hasBackdrop: true,
      data: {
        threads: this.threads(),
      },
    });
  }
}
