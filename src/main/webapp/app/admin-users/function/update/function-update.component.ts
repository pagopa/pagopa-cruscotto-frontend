import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FunctionFormGroup, FunctionFormService } from './function-form.service';
import { FunctionService } from '../service/function.service';
import { IFunction } from '../function.model';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-auth-function-update',
  templateUrl: './function-update.component.html',
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
  ],
})
export class FunctionUpdateComponent implements OnInit {
  isSaving = false;
  function: IFunction | null = null;

  private readonly functionService = inject(FunctionService);
  private readonly functionFormService = inject(FunctionFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);

  editForm: FunctionFormGroup = this.functionFormService.createFunctionFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authFunction }) => {
      this.function = authFunction;
      if (authFunction) {
        this.updateForm(authFunction);
      }
    });
  }

  updateForm(data: IFunction): void {
    this.function = data;
    this.functionFormService.resetForm(this.editForm, data);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const data = this.functionFormService.getFunction(this.editForm);
    if (data.id !== null) {
      this.subscribeToSaveResponse(this.functionService.update(data));
    } else {
      this.subscribeToSaveResponse(this.functionService.create(data));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFunction>>): void {
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
