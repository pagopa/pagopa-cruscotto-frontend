import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { JobService } from './job.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventManager } from '../../core/util/event-manager.service';
import SharedModule from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { DialogJobData } from './job.model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'jhi-job-edit-cron-modal',
  templateUrl: './job-edit-dialog.component.html',
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
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
  ],
})
export class JobEditDialogComponent {
  private readonly eventManager = inject(EventManager);
  private readonly jobsService = inject(JobService);
  private readonly formBuilder = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<JobEditDialogComponent>);

  data: DialogJobData = inject(MAT_DIALOG_DATA);

  schedulerForm = this.formBuilder.group({
    cronExpression: [null, [Validators.required, Validators.maxLength(200)]],
  });

  dismiss(): void {
    this.dialogRef.close();
  }

  confirm() {
    this.jobsService
      .update({
        jobName: this.data.job.jobName,
        cronExpression: this.schedulerForm.get(['cronExpression'])!.value,
      })
      .subscribe(() => {
        this.eventManager.broadcast({
          name: 'jobsListModification',
          content: 'Edit Job',
        });
        this.dismiss();
      });
  }
}
