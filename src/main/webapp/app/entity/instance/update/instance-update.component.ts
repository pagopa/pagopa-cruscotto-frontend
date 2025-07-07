import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IInstance } from '../models/instance.model';
import { InstanceService } from '../service/instance.service';
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
import { InstanceFormGroup, InstanceFormService } from './instance-form.service';
import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Authority } from 'app/config/authority.constants';
import { MatSlideToggle } from '@angular/material/slide-toggle';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-instance-update',
  templateUrl: './instance-update.component.html',
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
    MatSlideToggle,
  ],
})
export class InstanceUpdateComponent implements OnInit {
  isSaving = false;
  instance: IInstance | null = null;
  locale: string;

  protected readonly Authority = Authority;

  private readonly instanceService = inject(InstanceService);
  private readonly instanceFormService = inject(InstanceFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: InstanceFormGroup = this.instanceFormService.createInstanceFormGroup();

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instance }) => {
      this.instance = instance;
      if (instance) {
        this.updateForm(instance);
      }
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(instance: IInstance): void {
    this.instance = instance;
    this.instanceFormService.resetForm(this.editForm, instance);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const instance = this.instanceFormService.getInstance(this.editForm);

    if (instance.id !== null) {
      this.subscribeToSaveResponse(this.instanceService.update(instance));
    } else {
      this.subscribeToSaveResponse(this.instanceService.create(instance));
    }
  }

  clearDate(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.editForm.get(ctrlName)?.setValue(null));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstance>>): void {
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

  startFilter = (date: dayjs.Dayjs | null): boolean => {
    const endDate = this.editForm.get('analysisPeriodEndDate')?.value || dayjs().add(5, 'year');

    if (this.editForm.controls.predictedDateAnalysis.value) {
      this.editForm.controls.predictedDateAnalysis.updateValueAndValidity();
    }

    return date ? date.isSameOrBefore(endDate) : true;
  };

  endFilter = (date: dayjs.Dayjs | null): boolean => {
    const startDate = this.editForm.get('analysisPeriodStartDate')?.value || dayjs().add(-5, 'year');

    if (this.editForm.controls.predictedDateAnalysis.value) {
      this.editForm.controls.predictedDateAnalysis.updateValueAndValidity();
    }

    return date ? date.isSameOrAfter(startDate) : true;
  };

  predictedDateAnalysisFilter = (date: dayjs.Dayjs | null): boolean => {
    let referenceDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
    let isSameOrAfter = true;
    if (this.editForm.controls.analysisPeriodEndDate.value && referenceDate.isBefore(this.editForm.controls.analysisPeriodEndDate.value)) {
      referenceDate = this.editForm.controls.analysisPeriodEndDate.value;
      isSameOrAfter = false;
    } else if (
      this.editForm.controls.analysisPeriodStartDate.value &&
      referenceDate.isBefore(this.editForm.controls.analysisPeriodStartDate.value)
    ) {
      referenceDate = this.editForm.controls.analysisPeriodStartDate.value;
      isSameOrAfter = false;
    }
    return date ? (isSameOrAfter ? date.isSameOrAfter(referenceDate) : date.isAfter(referenceDate)) : true;
  };
}
