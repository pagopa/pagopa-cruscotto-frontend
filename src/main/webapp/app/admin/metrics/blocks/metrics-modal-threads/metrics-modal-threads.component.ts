import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import {IDialogMetricsData, Thread, ThreadState} from 'app/admin/metrics/metrics.model';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'jhi-thread-modal',
  templateUrl: './metrics-modal-threads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
})
export class MetricsModalThreadsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MetricsModalThreadsComponent>);

  data: IDialogMetricsData = inject(MAT_DIALOG_DATA);
  ThreadState = ThreadState;
  threadStateFilter: ThreadState | string = '';
  threadDumpAll = 0;
  threadDumpBlocked = 0;
  threadDumpRunnable = 0;
  threadDumpTimedWaiting = 0;
  threadDumpWaiting = 0;

  ngOnInit(): void {
    this.data.threads?.forEach(thread => {
      if (thread.threadState === ThreadState.Runnable) {
        this.threadDumpRunnable += 1;
      } else if (thread.threadState === ThreadState.Waiting) {
        this.threadDumpWaiting += 1;
      } else if (thread.threadState === ThreadState.TimedWaiting) {
        this.threadDumpTimedWaiting += 1;
      } else if (thread.threadState === ThreadState.Blocked) {
        this.threadDumpBlocked += 1;
      }
    });

    this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting + this.threadDumpTimedWaiting + this.threadDumpBlocked;
  }

  getThreads(): Thread[] {
    return this.data.threads?.filter(thread => !this.threadStateFilter || thread.threadState === this.threadStateFilter) ?? [];
  }

  dismiss(): void {
    this.dialogRef.close();
  }
}


