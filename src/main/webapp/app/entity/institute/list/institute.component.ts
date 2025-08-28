import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LocaltionHelper } from '../../../core/location/location.helper';
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
import { InstituteFilter } from './institute.filter';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { Authority } from 'app/config/authority.constants';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';
import { IInstitute } from '../institute.model';
import { InstituteService } from '../institute.service';
import { PartnerSelectComponent } from 'app/entity/partner/shared/partner-select/partner-select.component';
import { StationSelectComponent } from 'app/entity/station/shared/station-select/station-select.component';
import { InstituteSelectComponent } from '../shared/partner-select/institute-select.component';
import { addFilterToRequest, addToFilter, getFilterValue } from 'app/shared/pagination/filter-util.pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'jhi-creditor',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss'],
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
    MatCheckboxModule,
    RouterModule,
    YesOrNoViewComponent,
    PartnerSelectComponent,
    StationSelectComponent,
    InstituteSelectComponent,
  ],
})
export class InstituteComponent implements OnInit {
  displayedColumns: string[] = ['fiscalCode', 'name', 'partnerFiscalCode', 'partnerName', 'stationName', 'aca', 'standIn', 'enabled'];

  data: IInstitute[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  locale: string;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(InstituteFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly service = inject(InstituteService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group({
      partner: [''],
      station: [''],
      institute: [''],
      showNotActive: [''],
    });

    this.locale = this.translateService.currentLang;

    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
    }

    if (this.locationHelper.data) {
      this.filter.filters = this.locationHelper.data;
    }
  }

  ngOnInit(): void {
    this.updateForm();

    if (this.locationHelper.getIsBack() || this.locationHelper.data) {
      this.loadPage(this.filter.page, true);
      this.locationHelper.data = null;
    }

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(): void {
    this.searchForm.patchValue({
      partner: getFilterValue(this.filter, InstituteFilter.PARTNER),
      station: getFilterValue(this.filter, InstituteFilter.STATION),
      institute: getFilterValue(this.filter, InstituteFilter.INSTITUTE),
      showNotActive: getFilterValue(this.filter, InstituteFilter.SHOW_NOT_ACTIVE),
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
    void this.router.navigate(['/entity/institutions']);
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
      sort: [this.filter.sort.field + ',' + this.filter.sort.direction, 'partnerName,asc', 'stationName,asc'],
    };

    this.populateRequest(params);

    this.service.query(params).subscribe({
      next: (res: HttpResponse<IInstitute[]>) => {
        const data = res.body ?? [];
        this.onSuccess(data, res.headers);
      },
      error: () => this.onError(),
    });
  }

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, InstituteFilter.PARTNER, req);
    addFilterToRequest(this.filter, InstituteFilter.STATION, req);
    addFilterToRequest(this.filter, InstituteFilter.INSTITUTE, req);
    addFilterToRequest(this.filter, InstituteFilter.SHOW_NOT_ACTIVE, req);
  }

  private populateFilter(): void {
    this.filter.page = this.page;
    addToFilter(this.filter, this.searchForm.get('partner'), InstituteFilter.PARTNER);
    addToFilter(this.filter, this.searchForm.get('station'), InstituteFilter.STATION);
    addToFilter(this.filter, this.searchForm.get('institute'), InstituteFilter.INSTITUTE);
    addToFilter(this.filter, this.searchForm.get('showNotActive'), InstituteFilter.SHOW_NOT_ACTIVE);
  }

  sortData(sort: Sort): void {
    this.filter.sort = { field: sort.active, direction: sort.direction };
    this.updateForm();
    this.loadPage(this.page, false);
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IInstitute[], headers: HttpHeaders): void {
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
