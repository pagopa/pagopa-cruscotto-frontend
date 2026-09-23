import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, take } from 'rxjs';
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
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import SharedModule from '../../../shared/shared.module';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { SearchInstanceDTO } from '../../models/bulk-search.model';
import { BulkSearchService } from '../../services/bulk-search.service';
import { ConfirmModalOptions } from '../../../shared/modal/confirm-modal-options.model';
import { ConfirmModalService } from '../../../shared/modal/confirm-modal.service';
import { ModalResult } from '../../../shared/modal/modal-results.enum';

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

  statusValues: string[] = ['DRAFT', 'PLANNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'];
  isLoadingResults = false;
  locale: string;
  isUploadingCsv = false;

  searchForm: FormGroup;

  private allInstances: SearchInstanceDTO[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly router = inject(Router);
  private readonly confirmModalService = inject(ConfirmModalService);

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
    this.loadInstances();
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

  onSetAsPlanned(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }

    const confirmOptions = new ConfirmModalOptions(
      'entity.updateStatus.title',
      'pagopaCruscottoApp.ricercaMassiva.action.setAsPlanned',
      undefined,
      { name: instance.name ?? '' },
    );

    this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        if (result !== ModalResult.CONFIRMED) {
          return;
        }

        this.bulkSearchService.execute(instance.id!).subscribe(() => this.loadInstances());
      });
  }

  onViewDetail(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    void this.router.navigate(['/bulk/ricerca-massiva', instance.id, 'view']);
  }

  // Recupera i dati dell'istanza e reindirizza alla pagina di creazione precompilando il form con i criteri di ricerca.
  onDuplicate(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    const id = instance.id;
    this.subscriptions.add(
      this.bulkSearchService.get(id).subscribe(fullInstance => {
        void this.router.navigate(['/bulk/ricerca-massiva/new'], { state: { duplicateInstance: fullInstance } });
      }),
    );
  }

  onDownloadResult(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }
    this.subscriptions.add(
      this.bulkSearchService.downloadResult(instance.id).subscribe(blob => {
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

  onDelete(instance: SearchInstanceDTO): void {
    if (!instance.id) {
      return;
    }

    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'pagopaCruscottoApp.ricercaMassiva.action.delete', undefined, {
      name: instance.name ?? '',
    });

    this.confirmModalService
      .delete({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        if (result !== ModalResult.CONFIRMED) {
          return;
        }

        this.bulkSearchService.delete(instance.id!).subscribe(() => this.loadInstances());
      });
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
        .subscribe(page => {
          this.data = page.content ?? [];
          this.resultsLength = page.totalElements ?? 0;
          this.isLoadingResults = false;
          this.spinner.hide('isLoadingResults');
        }),
    );
  }
}
