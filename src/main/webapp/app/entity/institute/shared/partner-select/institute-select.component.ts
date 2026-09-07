import { Component, inject, Input, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, exhaustMap, finalize, map, scan, startWith, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import SharedModule from '../../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectInfiniteScrollDirective } from '../../../../shared/directives/mat-select-infinite-scroll.directive';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { HttpResponse } from '@angular/common/http';
import { IInstituteIdentification } from '../../institute.model';
import { addStringToReq } from 'app/shared/pagination/filter-util.pagination';
import { InstituteSelectService } from './institute-select.service';

interface IExtendInstitute extends Omit<IInstituteIdentification, ''> {
  order: number;
  orderForSort: number;
}

@Component({
  selector: 'jhi-institute-select',
  templateUrl: './institute-select.component.html',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatSelectInfiniteScrollDirective,
  ],
})
export class InstituteSelectComponent implements OnInit, OnDestroy {
  @ViewChild('jhiSelectInfiniteScroll', { static: true })
  infiniteScrollSelect!: MatSelect;

  @Input() parentForm!: FormGroup;
  @Input() formInnerControlName!: string;

  public filteringCtrl: FormControl<string | null> = new FormControl<string>('');
  public filteredData$: Observable<IExtendInstitute[]> = of([]);

  public searching = false;
  public loading = false;

  selected: IExtendInstitute | null = null;
  totalItems: any;
  searchTerm = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;
  batchSize = 20;
  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly service = inject(InstituteSelectService);
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.selected = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selected) {
      this.selected.order = this.i++;
      this.selected.orderForSort = -1;
    }

    const filter$ = this.filteringCtrl.valueChanges.pipe(startWith(''), debounceTime(200));

    this.filteredData$ = filter$.pipe(
      switchMap((value: any): Observable<IExtendInstitute[]> => {
        this.searchTerm = value;
        let currentPage = 0;
        this.countSelect = 0;
        this.i = 0;
        return this.incrementBatchOffset$.pipe(
          startWith(currentPage),
          tap(() => {
            if (value?.length >= 1) {
              this.searching = true;
            }
          }),
          exhaustMap(() => {
            return this.getList(value, currentPage);
          }),
          tap((partners: IInstituteIdentification[]) => (this.countSelect = this.countSelect + partners.length)),
          tap(() => (this.currentPage = ++currentPage)),
          tap(() => (this.searching = false)),
          /** Note: This is a custom operator because we also need the last emitted value.
           Note: Stop if there are no more pages, or no results at all for the current search text.
           */
          takeWhile(p => {
            return p.length > 0;
          }, true),
          scan((allPartners: IExtendInstitute[], newPartners: IInstituteIdentification[]) => {
            const extendedPartners: IExtendInstitute[] = newPartners.map(partner => ({
              ...partner,
              order: this.i++,
              orderForSort: this.i,
            }));

            if (this.selected) {
              this.service.sendId(String(this.selected.id), false, false);
              const foundIntoNewPartners = extendedPartners.findIndex((partner: { id: any }) => partner.id === this.selected?.id);
              const foundIntoAllPartners = allPartners.findIndex((partner: { id: any }) => partner.id === this.selected?.id);
              if (foundIntoNewPartners !== -1 && foundIntoAllPartners !== -1) {
                allPartners.splice(foundIntoAllPartners, 1);
              } else if (foundIntoNewPartners === -1 && foundIntoAllPartners === -1) {
                extendedPartners.push(this.selected);
              }
            }
            return allPartners.concat(extendedPartners);
          }, [] as IExtendInstitute[]),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getList(value: any, page: number): Observable<IInstituteIdentification[]> {
    return this.callService(value, page);
  }

  private callService(search: string, pageRequired: number): Observable<IInstituteIdentification[]> {
    this.loading = true;
    const req = {
      page: pageRequired,
      size: ITEMS_PER_PAGE,
      sort: ['name,asc'],
    };

    addStringToReq(search, 'name', req);
    addStringToReq(search, 'fiscalCode', req);

    // check showNotActive option (in institute search form)
    if (this.parentForm.get('showNotActive')?.value) {
      addStringToReq('true', 'showNotEnabled', req);
    }

    return this.service.query(req).pipe(
      map((value: HttpResponse<IInstituteIdentification[]>) => {
        const partners = value.body ?? [];
        this.totalItems = Number(value.headers.get('X-Total-Count'));
        return partners;
      }),
      catchError(() => of([])),
      finalize(() => {
        this.loading = false;
      }),
    );
  }

  compareFn(obj1: IExtendInstitute, obj2: IExtendInstitute): boolean {
    return obj1.id === obj2.id;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selected = matSelectChange.value as IExtendInstitute;
    this.service.sendId(String(matSelectChange.value.id), false, false); // Emit the selected partner's ID
  }

  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }
}
