import { Component, OnDestroy, inject, input, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalOptions } from '../../../shared/modal/confirm-modal-options.model';
import { ModalResult } from '../../../shared/modal/modal-results.enum';
import { ConfirmModalService } from '../../../shared/modal/confirm-modal.service';
import { GroupAssociatedFunctionsFilter } from './group.associated-functions.filter';
import { GroupService } from '../service/group.service';
import { IFunction } from '../../function/function.model';
import { FunctionService } from '../../function/service/function.service';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-auth-group-associated-functions',
  templateUrl: './group.associated-functions.component.html',
  styleUrls: ['./group.associated-functions.component.scss'],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
  ],
})
export class GroupAssociatedFunctionsComponent implements OnDestroy {
  groupId = input.required<number>();

  displayedColumns: string[] = ['action', 'id', 'modulo', 'nome', 'descrizione'];

  data: IFunction[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  isLoadingResults = false;
  selectedRowId: any;

  loadSubscriber?: Subscription;
  confirmSubscriber?: Subscription;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(GroupAssociatedFunctionsFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly groupService = inject(GroupService);
  private readonly functionService = inject(FunctionService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    effect(() => {
      if (!this.locationHelper.getIsBack()) {
        this.filter.clear();
      }

      this.updateForm();

      this.loadPage(this.filter.page, true);

      this.loadSubscriber = this.eventManager.subscribe('associatedFunctionsRefresh', () => this.loadPage(this.filter.page, false));
    });
  }

  updateForm(): void {
    this.page = this.filter.page;
  }

  changePage(event: PageEvent): void {
    this.filter.page = event.pageIndex + 1;
    this.updateForm();
    this.loadPage(event.pageIndex + 1, false);
  }

  loadPage(page: number, populateFilter: boolean): void {
    this.spinner.show('isLoadingAssociatedFunctions').then(() => {
      this.isLoadingResults = true;
    });

    this.page = page;

    if (populateFilter) {
      this.populateFilter();
    }

    const params = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: [this.filter.sort.field + ',' + this.filter.sort.direction],
    };

    this.functionService.findAssociateFunctionsToGroup(this.groupId(), params).subscribe({
      next: (res: HttpResponse<IFunction[]>) => {
        const data = res.body ?? [];
        this.onSuccess(data, res.headers);
      },
      error: () => this.onError(),
    });
  }

  sortData(sort: Sort): void {
    this.filter.sort = { field: sort.active, direction: sort.direction };
    this.updateForm();
    this.loadPage(this.page, false);
  }

  ngOnDestroy(): void {
    if (this.confirmSubscriber) {
      this.eventManager.destroy(this.confirmSubscriber);
    }
    if (this.loadSubscriber) {
      this.eventManager.destroy(this.loadSubscriber);
    }
  }

  private populateFilter(): void {
    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  remove(row: IFunction): void {
    this.selectedRowId = row.id;

    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.authGroup.manageFunctions.associatedFunctions.question.title',
      'pagopaCruscottoApp.authGroup.manageFunctions.associatedFunctions.question.message',
      undefined,
      undefined,
    );

    this.confirmSubscriber = this.confirmModalService
      .delete({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRowId = null;
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingAssociatedFunctions').then(() => {
            this.isLoadingResults = true;
          });
          this.groupService.dissociaFunzione(this.groupId(), row.id).subscribe({
            next: () => {
              let page = this.data.length === 1 && this.filter.page !== 1 ? this.filter.page - 1 : this.filter.page;

              this.loadPage(page, true);
              this.eventManager.broadcast('assignableFunctionsRefresh');
            },
            error: () => {
              this.spinner.hide('isLoadingAssociatedFunctions').then(() => {
                this.isLoadingResults = false;
              });
            },
          });
        }
      });
  }

  protected onSuccess(data: IFunction[], headers: HttpHeaders): void {
    this.resultsLength = Number(headers.get('X-Total-Count'));
    this.data = data;
    this.spinner.hide('isLoadingAssociatedFunctions').then(() => {
      this.isLoadingResults = false;
    });
  }

  protected onError(): void {
    this.data = [];
    this.spinner.hide('isLoadingAssociatedFunctions').then(() => {
      this.isLoadingResults = false;
    });
  }
}
