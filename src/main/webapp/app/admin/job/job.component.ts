import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { JobService } from './job.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IJob } from './job.model';
import SharedModule from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventManager } from '../../core/util/event-manager.service';
import { ConfirmModalService } from '../../shared/modal/confirm-modal.service';
import { ConfirmModalOptions } from '../../shared/modal/confirm-modal-options.model';
import { ModalResult } from '../../shared/modal/modal-results.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormatDatePipe } from '../../shared/date';
import { JobEditDialogComponent } from './job-edit-dialog.component';
import { Authority } from '../../config/authority.constants';

@Component({
  selector: 'jhi-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgxSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
    MatDialogModule,
    FormatDatePipe,
  ],
})
export class JobComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'schedulerName',
    'jobName',
    'groupName',
    'cron',
    'scheduleTime',
    'lastFiredTime',
    'nextFireTime',
    'jobStatus',
    'action',
  ];

  data: IJob[] = [];
  page!: number;

  isLoadingResults = false;
  selectedRow: IJob | null = null;

  loadSubscriber?: Subscription;

  locale: string;

  disabledButton = false;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly jobsService = inject(JobService);
  private readonly matDialog = inject(MatDialog);
  private readonly confirmModalService = inject(ConfirmModalService);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
    this.loadSubscriber = this.eventManager.subscribe('jobsListModification', () => this.loadPage());
  }

  ngOnInit(): void {
    this.loadPage();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.loadSubscriber) {
      this.eventManager.destroy(this.loadSubscriber);
    }
  }

  loadPage(): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isLoadingResults = true;
    });

    this.jobsService.query().subscribe({
      next: (res: HttpResponse<IJob[]>) => {
        const data = res.body ?? [];
        this.onSuccess(data);
      },
      error: () => this.onError(),
    });
  }

  protected onSuccess(data: IJob[]): void {
    this.data = data;
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
    });
  }

  protected onError(): void {
    this.data = [];
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
    });
  }

  sortData(sort: Sort) {
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.data = data;
      return;
    }

    this.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'jobName':
          return compare(a.jobName, b.jobName, isAsc);
        case 'groupName':
          return compare(a.groupName, b.groupName, isAsc);
        case 'jobStatus':
          return compare(a.jobStatus, b.jobStatus, isAsc);
        default:
          return 0;
      }
    });
  }

  start(job: IJob) {
    this.selectedRow = job;

    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.job.changeState.start.question.title',
      'pagopaCruscottoApp.job.changeState.start.question.message',
      undefined,
      undefined,
    );

    this.loadSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRow = null;
        if (result === ModalResult.CONFIRMED) {
          this.disabledButton = true;
          this.jobsService
            .start({
              jobName: job.jobName,
            })
            .subscribe(() => {
              this.disabledButton = false;
              this.loadPage();
            });
        }
      });
  }

  resume(job: IJob) {
    this.selectedRow = job;

    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.job.changeState.resume.question.title',
      'pagopaCruscottoApp.job.changeState.resume.question.message',
      undefined,
      undefined,
    );

    this.loadSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRow = null;
        if (result === ModalResult.CONFIRMED) {
          this.disabledButton = true;
          this.jobsService
            .resume({
              jobName: job.jobName,
            })
            .subscribe(() => {
              this.disabledButton = false;
              this.loadPage();
            });
        }
      });
  }

  pause(job: IJob) {
    this.selectedRow = job;

    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.job.changeState.pause.question.title',
      'pagopaCruscottoApp.job.changeState.pause.question.message',
      undefined,
      undefined,
    );

    this.loadSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRow = null;
        if (result === ModalResult.CONFIRMED) {
          this.disabledButton = true;
          this.jobsService
            .pause({
              jobName: job.jobName,
            })
            .subscribe(() => {
              this.disabledButton = false;
              this.loadPage();
            });
        }
      });
  }

  stop(job: IJob) {
    this.selectedRow = job;

    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.job.changeState.stop.question.title',
      'pagopaCruscottoApp.job.changeState.stop.question.message',
      undefined,
      undefined,
    );

    this.loadSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRow = null;
        if (result === ModalResult.CONFIRMED) {
          this.disabledButton = true;
          this.jobsService
            .stop({
              jobName: job.jobName,
            })
            .subscribe(() => {
              this.disabledButton = false;
              this.loadPage();
            });
        }
      });
  }

  edit(job: IJob) {
    this.selectedRow = job;

    const modal = this.matDialog.open(JobEditDialogComponent, {
      disableClose: true,
      width: '800px',
      maxWidth: '800px',
      hasBackdrop: true,
      position: {
        top: '100px',
      },
      data: {
        job: job,
      },
    });

    modal.afterClosed().subscribe(() => {
      this.selectedRow = null;
    });
  }

  previousState(): void {
    window.history.back();
  }

  toExecution(row: IJob): void {
    if (row) {
      // addValueToFilter(this.executionFilter, row.schedulerName, ExecutionFilter.SCHEDULER_NAME);
      // addValueToFilter(this.executionFilter, row.groupName, ExecutionFilter.JOB_GROUP);
      // addValueToFilter(this.executionFilter, row.jobName, ExecutionFilter.JOB_NAME);
      void this.router.navigate(['/admin/jobs/execution'], {
        queryParams: { schedulerName: row.schedulerName, groupName: row.groupName, jobName: row.jobName },
      });
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
