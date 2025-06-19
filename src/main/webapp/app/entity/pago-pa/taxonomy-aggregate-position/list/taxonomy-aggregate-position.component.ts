import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import SharedModule from 'app/shared/shared.module';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { LocaltionHelper } from 'app/core/location/location.helper';
import { Authority } from 'app/config/authority.constants';
import { TaxonomyAggregatePositionService } from '../service/taxonomy-aggregate-position.service';
import { FormatDatePipe } from '../../../../shared/date';
import { PagoPaTaxonomyAggregatePositionFilter } from './taxonomy-aggregate-position.filter';
import { IPagoPaTaxonomyAggregatePosition } from '../taxonomy-aggregate-position.model';
import { PartnerSelectComponent } from 'app/entity/partner/shared/partner-select/partner-select.component';
import { StationSelectComponent } from 'app/entity/station/shared/station-select/station-select.component';
import { addFilterToRequest, getFilterValue } from '../../../../shared/pagination/filter-util.pagination';
import { IPartner } from 'app/entity/partner/partner.model';
import { IStation } from 'app/entity/station/station.model';

@Component({
  selector: 'jhi-pago-pa-taxonomy-aggregate-position',
  templateUrl: './taxonomy-aggregate-position.component.html',
  styleUrl: './taxonomy-aggregate-position.component.scss',
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
    PartnerSelectComponent,
    StationSelectComponent,
  ],
})
export class PagoPaTaxonomyAggregatePositionComponent implements OnInit {
  displayedColumns: string[] = ['cfPartner', 'station', 'transferCategory', 'startDate', 'endDate', 'total'];

  locale: string;

  data: IPagoPaTaxonomyAggregatePosition[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(PagoPaTaxonomyAggregatePositionFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly pagoPaTaxonomyAggregatePositionService = inject(TaxonomyAggregatePositionService);
  private readonly fb = inject(FormBuilder);
  private readonly locationHelper = inject(LocaltionHelper);

  constructor() {
    this.searchForm = this.fb.group({
      partner: [''],
      station: [''],
    });

    this.locale = this.translateService.currentLang;

    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
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
      partner: getFilterValue(this.filter, PagoPaTaxonomyAggregatePositionFilter.PARTNER),
      station: getFilterValue(this.filter, PagoPaTaxonomyAggregatePositionFilter.STATION),
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
    void this.router.navigate(['/entity/pago-pa/taxonomy-aggregate-position']);
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

    this.pagoPaTaxonomyAggregatePositionService.query(params).subscribe({
      next: (res: HttpResponse<IPagoPaTaxonomyAggregatePosition[]>) => {
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

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, PagoPaTaxonomyAggregatePositionFilter.PARTNER, req);
    addFilterToRequest(this.filter, PagoPaTaxonomyAggregatePositionFilter.STATION, req);
  }

  private populateFilter(): void {
    this.filter.page = this.page;
    const partner = this.searchForm.get('partner')?.value as unknown as IPartner;
    this.filter.filters['cfPartner'] = partner?.fiscalCode;
    const station = this.searchForm.get('station')?.value as unknown as IStation;
    this.filter.filters['station'] = station?.name;
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IPagoPaTaxonomyAggregatePosition[], headers: HttpHeaders): void {
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
