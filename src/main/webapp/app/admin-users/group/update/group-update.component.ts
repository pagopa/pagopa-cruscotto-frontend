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
import { GroupFormGroup, GroupFormService } from './group-form.service';
import { IGroup } from '../group.model';
import { GroupService } from '../service/group.service';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-auth-group-update',
  templateUrl: './group-update.component.html',
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
export class GroupUpdateComponent implements OnInit {
  isSaving = false;
  group: IGroup | null = null;

  private readonly groupService = inject(GroupService);
  private readonly groupFormService = inject(GroupFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);

  editForm: GroupFormGroup = this.groupFormService.createGroupFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authGroup }) => {
      this.group = authGroup;
      if (authGroup) {
        this.updateForm(authGroup);
      }
    });
  }

  updateForm(data: IGroup): void {
    this.group = data;
    this.groupFormService.resetForm(this.editForm, data);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const data = this.groupFormService.getGroup(this.editForm);
    if (data.id !== null) {
      this.subscribeToSaveResponse(this.groupService.update(data));
    } else {
      this.subscribeToSaveResponse(this.groupService.create(data));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroup>>): void {
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
