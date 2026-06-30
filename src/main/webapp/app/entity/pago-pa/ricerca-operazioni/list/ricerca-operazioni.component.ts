import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import SharedModule from '../../../../shared/shared.module';
import { Authority } from '../../../../config/authority.constants';
import { LocaltionHelper } from '../../../../core/location/location.helper';
import { IOperazioneRicercaResponse, IOperazioneRicercaRow, RicercaOperazioniMode } from '../models/ricerca-operazioni.model';
import { RicercaOperazioniService } from '../service/ricerca-operazioni.service';
import { RicercaOperazioniFilter } from './ricerca-operazioni.filter';

const exclusiveSearchFieldsValidator = (control: AbstractControl): ValidationErrors | null => {
  const formValue = control.value as {
    iuv?: string | null;
    token?: string | null;
    idCarrello?: string | null;
    extra?: string | null;
  };

  const filledExclusiveFieldsCount = [formValue.iuv, formValue.token, formValue.idCarrello, formValue.extra].filter(
    fieldValue => !!fieldValue?.trim(),
  ).length;

  return filledExclusiveFieldsCount > 1 ? { exclusiveFieldsConflict: true } : null;
};

@Component({
  selector: 'jhi-ricerca-operazioni',
  templateUrl: './ricerca-operazioni.component.html',
  styleUrls: ['./ricerca-operazioni.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgxSpinnerModule,
  ],
})
export class RicercaOperazioniComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['paEmittente', 'numeroAvviso', 'iuv', 'action'];

  data: IOperazioneRicercaRow[] = [];
  resultsLength = 0;
  page = 1;
  pageSize = 10;

  sortActive: 'paEmittente' | 'numeroAvviso' | '' = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  _search = false;
  isLoadingResults = false;

  locale: string;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(RicercaOperazioniFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly service = inject(RicercaOperazioniService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);

  private readonly subscriptions = new Subscription();

  searchForm = this.fb.group(
    {
      paEmittente: ['', [Validators.pattern(/^\d{0,11}$/)]],
      nav: ['', [Validators.pattern(/^\d{0,18}$/)]],
      iuv: ['', [Validators.maxLength(35)]],
      token: ['', [Validators.pattern(/^[0-9a-f]{0,32}$/i)]],
      idCarrello: ['', [Validators.pattern(/^[A-Za-z0-9]{0,40}$/)]],
      extra: [''],
    },
    { validators: [exclusiveSearchFieldsValidator] },
  );

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.locale = event.lang;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  search(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.page = 1;
    this.loadPage();
  }

  clear(): void {
    this.searchForm.reset({ paEmittente: '', nav: '', iuv: '', token: '', idCarrello: '', extra: '' });
    this.filter.clear();
    this.data = [];
    this._search = false;
    this.page = 1;
    this.pageSize = 10;
    this.resultsLength = 0;
    this.sortActive = '';
    this.sortDirection = '';
    this.displayedColumns = ['paEmittente', 'numeroAvviso', 'iuv', 'action'];
  }

  changePage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.loadPage();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      return;
    }

    if (sort.active !== 'paEmittente' && sort.active !== 'numeroAvviso') {
      return;
    }

    this.sortActive = sort.active;
    this.sortDirection = sort.direction;
    this.page = 1;
    this.loadPage();
  }

  previousState(): void {
    window.history.back();
  }

  private detectMode(): RicercaOperazioniMode | null {
    const { paEmittente, nav, iuv, token, idCarrello, extra } = this.searchForm.value;
    if (extra?.trim()) return 'extra';
    if (nav?.trim()) return 'nav';
    if (iuv?.trim()) return 'iuv';
    if (token?.trim()) return 'token';
    if (idCarrello?.trim()) return 'cart';
    if (paEmittente?.trim()) return 'paEmittente';
    return null;
  }

  private updateDisplayedColumns(): void {
    const base = ['paEmittente', 'numeroAvviso'];
    if (this.filter.mode === 'extra') {
      this.displayedColumns = [...base, 'infoAggiuntiveType', 'infoAggiuntiveValue', 'action'];
    } else {
      this.displayedColumns = [...base, 'action'];
    }
  }

  private buildSortParam(): string | undefined {
    if (!this.sortActive || !this.sortDirection) {
      return undefined;
    }
    const field = (this.sortActive as string) === 'numeroAvviso' ? 'nav' : 'paEmittente';
    return `${field},${this.sortDirection}`;
  }

  private loadPage(): void {
    const { paEmittente, nav, iuv, token, idCarrello, extra } = this.searchForm.value;
    const mode = this.detectMode();
    if (!mode) return;

    this.filter.mode = mode;
    this.filter.search = true;
    this._search = true;
    this.isLoadingResults = true;
    this.updateDisplayedColumns();

    this.spinner.show('isLoadingResults');

    this.service
      .search({
        pa: paEmittente?.trim() || undefined,
        nav: nav?.trim() || undefined,
        iuv: iuv?.trim() || undefined,
        token: token?.trim() || undefined,
        idCarrello: idCarrello?.trim() || undefined,
        info: extra?.trim() || undefined,
        page: this.page - 1,
        size: this.pageSize,
        sort: this.buildSortParam(),
      })
      .subscribe({
        next: (res: HttpResponse<IOperazioneRicercaResponse>) => {
          const body = res.body!;
          this.data = body.content;
          this.resultsLength = body.totalElements;
          this.isLoadingResults = false;
          this.spinner.hide('isLoadingResults');
        },
        error: () => {
          this.isLoadingResults = false;
          this.spinner.hide('isLoadingResults');
        },
      });
  }
}
