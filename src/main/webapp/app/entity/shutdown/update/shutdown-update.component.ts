import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IShutdown } from '../shutdown.model';
import { ShutdownService } from '../service/shutdown.service';
import { ShutdownFormGroup, ShutdownFormService } from './shutdown-form.service';
import { StationSelectComponent } from 'app/entity/station/shared/station-select/station-select.component';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Authority } from 'app/config/authority.constants';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-shutdown-update',
  templateUrl: './shutdown-update.component.html',
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxSpinnerModule,
    RouterModule,
    MatDatepickerModule,
    PartnerSelectComponent,
    StationSelectComponent,
    MatTimepickerModule,
  ],
})
export class ShutdownUpdateComponent implements OnInit {
  isSaving = false;
  shutdown: IShutdown | null = null;
  minDateFrom = dayjs().add(1, 'day');
  locale: string;

  protected readonly Authority = Authority;

  private readonly shutdownService = inject(ShutdownService);
  private readonly shutdownFormService = inject(ShutdownFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: ShutdownFormGroup = this.shutdownFormService.createShutdownFormGroup();
  partnerId$ = new BehaviorSubject<number | null>(null);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shutdown }) => {
      this.shutdown = shutdown;
      if (shutdown) {
        this.updateForm(shutdown);
      }

      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        if (control !== null) control.markAsTouched({ onlySelf: true });
      });
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  onPartnerSelected(partnerId: number | null): void {
    this.partnerId$.next(partnerId);
  }

  updateForm(shutdown: IShutdown): void {
    this.shutdown = shutdown;
    this.shutdownFormService.resetForm(this.editForm, shutdown);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const shutdown = this.shutdownFormService.getShutdown(this.editForm);

    if (shutdown.id !== null) {
      this.subscribeToSaveResponse(this.shutdownService.update(shutdown));
    } else {
      this.subscribeToSaveResponse(this.shutdownService.create(shutdown));
    }
  }

  clearFields(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.editForm.get(ctrlName)?.setValue(null));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShutdown>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.spinner.hide('isSaving').then(() => {
      this.isSaving = false;
    });
  }

  minDateRangeValidator = (d: dayjs.Dayjs | null): boolean => {
    const maxDate = this.editForm.get('shutdownEndDate')?.value || dayjs().add(1, 'year');

    if (maxDate && d !== null) {
      return d.isSameOrBefore(maxDate);
    }
    return true;
  };

  maxDateRangeValidator = (d: dayjs.Dayjs | null): boolean => {
    const minDate = this.editForm.get('shutdownStartDate')?.value || dayjs().add(-1, 'year');
    if (minDate && d !== null) {
      return d.isSameOrAfter(minDate);
    }

    return true;
  };
}
