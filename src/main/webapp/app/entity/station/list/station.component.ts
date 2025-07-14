import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { Authority } from 'app/config/authority.constants';
import { IStation } from '../station.model';
import { StationFilter } from './station.filter';
import { StationService } from '../service/station.service';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';
import { PartnerSelectComponent } from 'app/entity/partner/shared/partner-select/partner-select.component';
import { StationSelectComponent } from '../shared/station-select/station-select.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { addFilterToRequest, addToFilter, getFilterValue } from 'app/shared/pagination/filter-util.pagination';

@Component({
  selector: 'jhi-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
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
    FormatDatePipe,
    YesOrNoViewComponent,
    PartnerSelectComponent,
    StationSelectComponent,
    MatCheckboxModule,
  ],
})
export class StationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'activationDate',
    'partnerFiscalCode',
    'partnerName',
    'typeConnection',
    'primitiveVersion',
    'paymentOption',
    'status',
    'deactivationDate',
    'associatedInstitutes',
    'action',
  ];

  data: IStation[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  locale: string;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(StationFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly stationService = inject(StationService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group({
      takingsIdentifier: [null, [Validators.maxLength(12)]],
      partner: [''],
      station: [''],
      showNotActive: [''],
    });

    this.locale = this.translateService.currentLang;
    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
    }
    if (this.locationHelper.data) {
      this.filter.filters = this.locationHelper.data;
      this.locationHelper.data = null;
    }
  }

  ngOnInit(): void {
    this.updateForm();

    if (this.locationHelper.getIsBack()) {
      this.loadPage(this.filter.page, true);
    }

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(): void {
    this.searchForm.patchValue({
      partner: getFilterValue(this.filter, StationFilter.PARTNER),
      station: getFilterValue(this.filter, StationFilter.STATION),
      showNotActive: getFilterValue(this.filter, StationFilter.SHOW_NOT_ACTIVE),
    });
    this.page = this.filter.page;
  }

  search(): void {
    this.data = [];
    this.filter.clear();

    this.loadPage(1, true);
  }

  clear(): void {
    this._search = false;
    this.data = [];
    this.filter.clear();
    this.updateForm();
    void this.router.navigate(['/entity/stations']);
  }

  changePage(event: PageEvent): void {
    this.filter.page = event.pageIndex + 1;
    this.updateForm();
    this.loadPage(event.pageIndex + 1, false);
  }

  loadPage(page: number, populateFilter: boolean): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isLoadingResults = true;
    });

    this._search = true;
    this.page = page;

    if (populateFilter) {
      this.populateFilter();
    }

    const params = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: [this.filter.sort.field + ',' + this.filter.sort.direction],
    };

    this.populateRequest(params);

    this.stationService.query(params).subscribe({
      next: (res: HttpResponse<IStation[]>) => {
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
  }

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, StationFilter.PARTNER, req);
    addFilterToRequest(this.filter, StationFilter.STATION, req);
    addFilterToRequest(this.filter, StationFilter.SHOW_NOT_ACTIVE, req);
  }

  private populateFilter(): void {
    this.filter.page = this.page;
    addToFilter(this.filter, this.searchForm.get('partner'), StationFilter.PARTNER);
    addToFilter(this.filter, this.searchForm.get('station'), StationFilter.STATION);
    addToFilter(this.filter, this.searchForm.get('showNotActive'), StationFilter.SHOW_NOT_ACTIVE);
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IStation[], headers: HttpHeaders): void {
    this.resultsLength = Number(headers.get('X-Total-Count'));
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
}
