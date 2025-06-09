import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';
import { IGroup } from '../group.model';
import { CdkTreeModule } from '@angular/cdk/tree';
import { GroupService } from '../service/group.service';
import { finalize } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-auth-group-visibility-management',
  templateUrl: './group.visibility-management.component.html',
  styleUrls: ['./group.visibility-management.component.scss'],
  imports: [
    SharedModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatListModule,
    MatLineModule,
    MatIconModule,
    CdkTreeModule,
    NgxSpinnerComponent,
    DragDropModule,
  ],
})
export class GroupVisibilityManagementComponent implements OnInit {
  isSaving = false;
  isLoading = false;
  isChanged = false;

  groups: IGroup[] = [];

  protected readonly Authority = Authority;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly groupService = inject(GroupService);

  ngOnInit(): void {
    this.getAllAuthGroups();
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.isChanged = true;

    moveItemInArray(this.groups, event.previousIndex, event.currentIndex);

    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].livelloVisibilita = i + 1;
    }
  }

  save(): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isSaving = true;
    });

    this.subscribeToSaveResponse(this.groupService.aggiornaLivelloVisibilita(this.groups));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<void>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.spinner.hide('isSaving').then(() => {
      this.isSaving = false;
    });
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.isChanged = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private getAllAuthGroups(): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isLoading = true;
    });

    const req = {
      size: 200,
      sort: ['livelloVisibilita,asc', 'id,asc'],
    };

    this.groupService.query(req).subscribe({
      next: (res: HttpResponse<IGroup[]>) => {
        const data = res.body ?? [];
        this.onSuccess(data);
      },
      error: () => this.onError(),
    });
  }

  protected onSuccess(data: IGroup[]): void {
    this.groups = data;
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoading = false;
    });
  }

  protected onError(): void {
    this.groups = [];
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoading = false;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
