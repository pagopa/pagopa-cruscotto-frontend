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
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IShutdown } from '../shutdown.model';
import { ShutdownService } from '../service/shutdown.service';
import { ShutdownFormGroup, ShutdownFormService } from './shutdown-form.service';

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
  ],
})
export class ShutdownUpdateComponent implements OnInit {
  isSaving = false;
  shutdown: IShutdown | null = null;
  minDateFrom = dayjs().add(1, 'day');
  locale: string;

  private readonly shutdownService = inject(ShutdownService);
  private readonly shutdownFormService = inject(ShutdownFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: ShutdownFormGroup = this.shutdownFormService.createShutdownFormGroup();

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

  clearDate(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.editForm.get(ctrlName)?.setValue(null));
  }

  predictedDateAnalysisValidator = (d: dayjs.Dayjs | null): boolean => {
    const result = d ? d > dayjs() : false;

    if (result) {
      const analysisPeriodStartDateControl = this.editForm.get('analysisPeriodStartDate');
      const analysisPeriodEndDateControl = this.editForm.get('analysisPeriodEndDate');
      analysisPeriodStartDateControl?.updateValueAndValidity();
      analysisPeriodEndDateControl?.updateValueAndValidity();
    }

    return result;
  };
  /*
  rangeFilter = (d: dayjs.Dayjs | null): boolean => {
    if (d === null) {
      return false;
    }

    if (this.editForm === undefined) {
      return true;
    }

    const predictedDateAnalysis = this.editForm.get('predictedDateAnalysis')?.value;
    if (!predictedDateAnalysis) {
      return true;
    }

    return d < predictedDateAnalysis;
  };*/

  rangeFilter = (d: dayjs.Dayjs | null): boolean => {
    return false;
  };

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
}
