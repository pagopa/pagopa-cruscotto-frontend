import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { Authority } from '../../../../config/authority.constants';
import { LocaltionHelper } from '../../../../core/location/location.helper';
import { IOperazioneRicercaResponse, IOperazioneRicercaRow, RicercaOperazioniMode } from '../models/ricerca-operazioni.model';
import { RicercaOperazioniService } from '../service/ricerca-operazioni.service';
import { RicercaOperazioniFilter } from './ricerca-operazioni.filter';

const hasTrimmedValue = (group: AbstractControl, key: string): boolean => !!group.get(key)?.value?.trim();

/**
 * Regole combinazione campi:
 * - PA o NAV devono essere presenti (almeno uno).
 * - Tra i campi secondari (token, idCarrello, extra) ne puo essere valorizzato al massimo uno.
 */
const searchCombinationValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const hasPa = hasTrimmedValue(group, 'paEmittente');
  const hasNav = hasTrimmedValue(group, 'nav');
  const secondaryCount = ['token', 'idCarrello', 'extra'].filter(key => hasTrimmedValue(group, key)).length;

  const errors: ValidationErrors = {};

  // if (!hasPa && !hasNav) {
  //   errors.primaryFieldRequired = true;
  // }

  if (secondaryCount > 1) {
    errors.secondaryExclusive = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
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
  displayedColumns: string[] = ['paEmittente', 'numeroAvviso', 'action'];

  data: IOperazioneRicercaRow[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;

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
      paEmittente: ['', [Validators.pattern(/^\d{11}$/)]],
      nav: ['', [Validators.pattern(/^\d{18}$/)]],
      token: ['', [Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)]],
      idCarrello: ['', [Validators.pattern(/^[A-Za-z0-9]{35}$/)]],
      extra: [''],
    },
    { validators: searchCombinationValidator },
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

    // Quando un campo esclusivo viene valorizzato, pulire gli altri
    const exclusiveKeys: Array<'token' | 'idCarrello' | 'extra'> = ['token', 'idCarrello', 'extra'];
    exclusiveKeys.forEach(key => {
      this.subscriptions.add(
        this.searchForm.get(key)!.valueChanges.subscribe(val => {
          if (val?.trim()) {
            exclusiveKeys
              .filter(k => k !== key)
              .forEach(other => {
                const ctrl = this.searchForm.get(other)!;
                if (ctrl.value) {
                  ctrl.setValue('', { emitEvent: false });
                }
              });
          }
        }),
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  search(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { paEmittente, nav, token, idCarrello, extra } = this.searchForm.value;
    const mode = this.detectMode();
    if (!mode) return;

    this.filter.mode = mode;
    this.filter.search = true;
    this._search = true;
    this.isLoadingResults = true;
    this.updateDisplayedColumns();

    this.spinner.show('isLoadingResults');

    // Nota: l'endpoint unificato /api/search non supporta paginazione lato server.
    // La paginazione viene gestita lato client sui risultati restituiti.
    this.service
      .search({
        pa: paEmittente?.trim() || undefined,
        nav: nav?.trim() || undefined,
        token: token?.trim() || undefined,
        idCarrello: idCarrello?.trim() || undefined,
        info: extra?.trim() || undefined,
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

  clear(): void {
    this.searchForm.reset({ paEmittente: '', nav: '', token: '', idCarrello: '', extra: '' });
    this.filter.clear();
    this.data = [];
    this._search = false;
    this.page = 1;
    this.resultsLength = 0;
    this.displayedColumns = ['paEmittente', 'numeroAvviso', 'action'];
  }

  changePage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.search();
  }

  sortData(sort: Sort): void {
    this.filter.sort = { field: sort.active, direction: sort.direction || 'asc' };
    this.page = 1;
    this.search();
  }

  previousState(): void {
    window.history.back();
  }

  private detectMode(): RicercaOperazioniMode | null {
    const { paEmittente, nav, token, idCarrello, extra } = this.searchForm.value;
    if (extra?.trim()) return 'extra';
    if (nav?.trim()) return 'nav';
    if (token?.trim()) return 'token';
    if (idCarrello?.trim()) return 'cart';
    if (paEmittente?.trim()) return 'nav';
    return null;
  }

  private updateDisplayedColumns(): void {
    const base = ['paEmittente', 'numeroAvviso'];
    if (this.filter.mode === 'extra') {
      this.displayedColumns = [...base, 'infoAggiuntive', 'action'];
    } else {
      this.displayedColumns = [...base, 'action'];
    }
  }
}
