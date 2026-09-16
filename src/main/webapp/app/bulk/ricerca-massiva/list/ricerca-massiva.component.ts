import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, catchError, map, of, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import SharedModule from '../../../shared/shared.module';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import dayjs from '../../../config/dayjs';
import { SearchInstanceDTO } from '../../models/bulk-search.model';
import { BulkSearchService } from '../../services/bulk-search.service';
import { RICERCA_MASSIVA_CSV_VALIDATION_ERRORS, RICERCA_MASSIVA_MOCK, getRicercaMassivaDetailMock } from '../ricerca-massiva.mock';
import { RicercaMassivaCsvErrorsModalComponent } from './ricerca-massiva-csv-errors-modal.component';

@Component({
  selector: 'jhi-ricerca-massiva',
  templateUrl: './ricerca-massiva.component.html',
  styleUrls: ['./ricerca-massiva.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormatDatePipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgxSpinnerModule,
  ],
})
export class RicercaMassivaComponent implements OnInit, OnDestroy {
  readonly displayedColumns: string[] = ['createdAt', 'name', 'status', 'action'];

  data: SearchInstanceDTO[] = [];
  resultsLength = 0;
  page = 1;
  pageSize = ITEMS_PER_PAGE;

  sortActive: 'createdAt' | 'name' | 'status' = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusValues: string[] = [];
  isLoadingResults = false;
  locale: string;
  isUploadingCsv = false;

  searchForm: FormGroup;

  private allInstances: SearchInstanceDTO[] = [];
  private filteredInstances: SearchInstanceDTO[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  private readonly subscriptions = new Subscription();

  constructor() {
    this.locale = this.translateService.currentLang;
    this.searchForm = this.fb.group({
      createdFrom: [null as Date | null],
      createdTo: [null as Date | null],
      name: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.loadInstances();

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
    this.page = 1;
    this.loadInstances();
  }

  clear(): void {
    this.searchForm.reset({ createdFrom: null, createdTo: null, name: '', status: '' });
    this.page = 1;
    this.applyFilters();
  }

  clearFields(...controlNames: string[]): void {
    controlNames.forEach(controlName => this.searchForm.get(controlName)?.setValue(null));
  }

  changePage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadInstances();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      return;
    }
    this.sortActive = sort.active as 'createdAt' | 'name' | 'status';
    this.sortDirection = sort.direction;
    this.page = 1;
    this.loadInstances();
  }

  previousState(): void {
    window.history.back();
  }

  onCsvUpload(): void {
    void this.router.navigate(['/bulk/ricerca-massiva/csv']);
  }

  onNewInstance(): void {
    void this.router.navigate(['/bulk/ricerca-massiva/new']);
  }

  trackId(_index: number, item: SearchInstanceDTO): string {
    return item.id ?? '';
  }

  // TODO: call bulkSearchService.lifecycleAction / dedicated endpoint to plan the instance
  onSetAsPlanned(_instance: SearchInstanceDTO): void {
    // implementazione da definire
  }

  onViewDetail(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    void this.router.navigate(['/bulk/ricerca-massiva', instance.id, 'view']);
  }

  // Recupera i dati dell'istanza (con fallback al mock finché l'endpoint GET by id non è disponibile)
  // e reindirizza alla pagina di creazione precompilando il form con i criteri di ricerca.
  onDuplicate(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    const id = instance.id;
    this.subscriptions.add(
      this.bulkSearchService
        .get(id)
        .pipe(catchError(() => of(getRicercaMassivaDetailMock(id))))
        .subscribe(fullInstance => {
          void this.router.navigate(['/bulk/ricerca-massiva/new'], { state: { duplicateInstance: fullInstance } });
        }),
    );
  }

  onDownloadResult(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    this.subscriptions.add(
      this.bulkSearchService.download(instance.id).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${instance.name ?? 'risultato'}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }),
    );
  }

  // TODO: ask confirmation, then call bulkSearchService.delete(id) and reload the list
  onDelete(_instance: SearchInstanceDTO): void {
    // implementazione da definire
  }

  private loadInstances(): void {
    this.isLoadingResults = true;
    this.spinner.show('isLoadingResults');

    this.subscriptions.add(
      this.bulkSearchService
        .list({
          page: this.page - 1,
          size: this.pageSize,
          sort: [`${this.sortActive},${this.sortDirection}`],
        })
        // TODO: rimuovere il fallback al mock quando l'endpoint sarà disponibile
        .pipe(catchError(() => of({ content: RICERCA_MASSIVA_MOCK, totalElements: RICERCA_MASSIVA_MOCK.length })))
        .subscribe(page => {
          this.allInstances = page.content ?? [];
          this.statusValues = Array.from(new Set(this.allInstances.map(instance => instance.status).filter((s): s is string => !!s))).sort(
            (a, b) => a.localeCompare(b),
          );
          this.resultsLength = page.totalElements ?? this.allInstances.length;
          this.applyFilters();
          this.isLoadingResults = false;
          this.spinner.hide('isLoadingResults');
        }),
    );
  }

  private applyFilters(): void {
    const { createdFrom, createdTo, name, status } = this.searchForm.value;
    const from = createdFrom ? dayjs(createdFrom).startOf('day') : null;
    const to = createdTo ? dayjs(createdTo).endOf('day') : null;
    const nameFilter = name?.trim().toLowerCase();

    this.filteredInstances = this.allInstances.filter(instance => {
      if (nameFilter && !instance.name?.toLowerCase().includes(nameFilter)) {
        return false;
      }
      if (status && instance.status !== status) {
        return false;
      }
      if (from || to) {
        const createdAt = instance.createdAt ? dayjs(instance.createdAt) : null;
        if (!createdAt?.isValid()) {
          return false;
        }
        if (from && createdAt.isBefore(from)) {
          return false;
        }
        if (to && createdAt.isAfter(to)) {
          return false;
        }
      }
      return true;
    });

    this.data = this.filteredInstances;
  }
}
