import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PermissionService } from '../service/permission.service';
import { IPermission } from '../permission.model';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Authority } from '../../../config/authority.constants';
import { PermissionFormGroup, PermissionFormService } from './permission-form.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-auth-permission-update',
  templateUrl: './permission-update.component.html',
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
export class PermissionUpdateComponent implements OnInit {
  isSaving = false;
  permission: IPermission | null = null;

  private readonly permissionService = inject(PermissionService);
  private readonly permissionFormService = inject(PermissionFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);

  editForm: PermissionFormGroup = this.permissionFormService.createPermissionFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permission }) => {
      this.permission = permission;
      if (permission) {
        this.updateForm(permission);
      }
    });
  }

  updateForm(permission: IPermission): void {
    this.permission = permission;
    this.permissionFormService.resetForm(this.editForm, permission);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const permission = this.permissionFormService.getPermission(this.editForm);
    if (permission.id !== null) {
      this.subscribeToSaveResponse(this.permissionService.update(permission));
    } else {
      this.subscribeToSaveResponse(this.permissionService.create(permission));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPermission>>): void {
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
