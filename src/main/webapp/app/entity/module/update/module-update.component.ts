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

import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { IModule, IModuleConfiguration, ModuleConfiguration } from '../module.model';
import { ModuleService } from '../service/module.service';
import { ModuleFormGroup, ModuleFormService } from './module-form.service';
import { Authority } from 'app/config/authority.constants';

/* eslint-disable no-console */

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'jhi-kpi-configuration-update',
  templateUrl: './module-update.component.html',
  styleUrls: ['./module-update.component.scss'],
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
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class ModuleUpdateComponent implements OnInit {
  isSaving = false;
  module: IModule | null = null;

  moduleConfiguration: IModuleConfiguration = new ModuleConfiguration();

  locale: string;
  emptyOption = '';
  booleanOptions: { value: boolean; text: string }[] = [
    { value: true, text: 'values.yes' },
    { value: false, text: 'values.no' },
  ];
  statusOptions: { value: string; text: string }[] = [
    { value: 'ATTIVO', text: 'pagopaCruscottoApp.module.update.status.active' },
    { value: 'NON_ATTIVO', text: 'pagopaCruscottoApp.module.update.status.inactive' },
  ];
  analysisTypeOptions: { value: string; text: string }[] = [
    { value: 'AUTOMATICA', text: 'pagopaCruscottoApp.module.update.analysisType.automatic' },
    { value: 'MANUALE', text: 'pagopaCruscottoApp.module.update.analysisType.manual' },
  ];

  protected readonly Authority = Authority;

  private readonly moduleService = inject(ModuleService);
  private readonly moduleFormService = inject(ModuleFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: ModuleFormGroup = this.moduleFormService.createModuleFormGroup();

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ module }) => {
      this.module = module;
      if (module) {
        this.moduleConfiguration = new ModuleConfiguration(module as IModuleConfiguration);
        this.updateForm(module);
      } else {
        this.moduleFormService.prepareEmptyForm(this.editForm);
      }
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(module: IModule): void {
    this.module = module;
    this.moduleFormService.resetForm(this.editForm, module);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });

    const module = this.moduleFormService.getModule(this.editForm);

    if (module.id !== null) {
      this.subscribeToSaveResponse(this.moduleService.update(module));
    } else {
      this.subscribeToSaveResponse(this.moduleService.create(module));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModule>>): void {
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

  selectModule(module: IModule): void {
    console.log(module);
    this.moduleConfiguration = new ModuleConfiguration(module as IModuleConfiguration);
    console.log(this.moduleConfiguration);
  }
}
