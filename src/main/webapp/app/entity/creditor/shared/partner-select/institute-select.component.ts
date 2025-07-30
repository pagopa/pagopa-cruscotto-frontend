import { Component, inject, Input, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  exhaustMap,
  filter,
  finalize,
  map,
  scan,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import SharedModule from '../../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectInfiniteScrollDirective } from '../../../../shared/directives/mat-select-infinite-scroll.directive';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { HttpResponse } from '@angular/common/http';
import { IInstitute } from '../../institute.model';
import { InstituteService } from '../../institute.service';
import { addStringToReq } from 'app/shared/pagination/filter-util.pagination';

interface IExtendPartner extends Omit<IInstitute, ''> {
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

  public partnerFilteringCtrl: FormControl<string | null> = new FormControl<string>('');

  public searching = false;

  protected partner: IExtendPartner[] = [];

  filteredData$: Observable<IExtendPartner[]> = of([]);
  selectPartner: IExtendPartner | null = null;
  loading = false;
  totalItems: any;
  searchTerm = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;
  batchSize = 20;
  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly service = inject(InstituteService);
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.selectPartner = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selectPartner) {
      this.selectPartner.order = this.i++;
      this.selectPartner.orderForSort = -1;
    }

    const filter$ = this.partnerFilteringCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      filter(q => typeof q === 'string' || q === null),
    );

    this.filteredData$ = filter$.pipe(
      switchMap((value: any) => {
        this.searchTerm = value;
        let currentPage = 0;
        this.countSelect = 0;
        this.i = 0;
        console.log('Search ' + value);
        return this.incrementBatchOffset$.pipe(
          startWith(currentPage),
          tap(() => {
            if (value !== null && value !== '' && value !== undefined && value.length >= 1) {
              this.searching = true;
            }
          }),
          exhaustMap(() => {
            return this.getList(value, currentPage);
          }),
          tap(partners => (this.countSelect = (this.countSelect ?? 0) + partners.length)),
          tap(() => (this.currentPage = ++currentPage)),
          tap(() => (this.searching = false)),
          /** Note: This is a custom operator because we also need the last emitted value.
           Note: Stop if there are no more pages, or no results at all for the current search text.
           */
          takeWhile(p => {
            return p.length > 0;
          }, true),
          scan((allPartners: any[], newPartners: any[]) => {
            let i = 0;

            newPartners.forEach(partner => {
              partner.order = this.i++;
              partner.orderForSort = partner.order;
            });

            if (this.selectPartner) {
              this.service.sendPartnerId(String(this.selectPartner?.id), false, false);
              const foundIntoNewPartners = newPartners.findIndex(
                (partner: { id: any }) => partner.id === (this.selectPartner && this.selectPartner.id),
              );
              const foundIntoAllPartners = allPartners.findIndex(
                (partner: { id: any }) => partner.id === (this.selectPartner && this.selectPartner.id),
              );
              if (foundIntoNewPartners !== -1 && foundIntoAllPartners !== -1) {
                allPartners.splice(foundIntoAllPartners, 1);
              } else if (foundIntoNewPartners === -1 && foundIntoAllPartners === -1) {
                newPartners.push(this.selectPartner);
              }
            }
            return allPartners.concat(newPartners);
          }, []),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getList(value: any, page: number): Observable<IInstitute[]> {
    return this.callService(value, page);
  }

  private callService(search: string, pageRequired: number): Observable<IInstitute[]> {
    this.loading = true;
    const req = {
      page: pageRequired,
      size: ITEMS_PER_PAGE,
      sort: ['name,asc'],
    };

    addStringToReq(search, 'name', req);
    addStringToReq(search, 'fiscalCode', req);

    return this.service.query(req).pipe(
      map((value: HttpResponse<IInstitute[]>) => {
        const partners = value.body || [];
        this.totalItems = Number(value.headers.get('X-Total-Count'));
        return partners;
      }),
      catchError(() => {
        return [];
      }),
      finalize(() => {
        this.loading = false;
      }),
    );
  }

  compareFn(obj1: IExtendPartner, obj2: IExtendPartner) {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selectPartner = matSelectChange.value as IExtendPartner;
    this.service.sendPartnerId(String(matSelectChange.value.id), false, false); // Emit the selected partner's ID
  }

  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }
}
