import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
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
import { IPartner } from '../../../partner/partner.model';
import { addNumericToReq, addStringToReq } from '../../../../shared/pagination/filter-util.pagination';
import { ICreditor } from '../../creditor.model';
import { CreditorService } from '../../creditor.service';
import { PartnerSelectComponent } from 'app/entity/partner/shared/partner-select/partner-select.component';

interface IExtendedCreditor extends Omit<ICreditor, ''> {
  order: number;
  orderForSort: number;
}

@Component({
  selector: 'jhi-creditor-select',
  templateUrl: './creditor-select.component.html',
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
export class CreditorSelectComponent implements OnInit, OnDestroy {
  @ViewChild('jhiSelectInfiniteScroll', { static: true })
  infiniteScrollSelect!: MatSelect;

  @Input() parentForm!: FormGroup;
  @Input() formInnerControlName!: string;
  @Input() partnerControlName!: string;

  _partner: IPartner | null = null;

  first: boolean = true;
  filteredData$: Observable<IExtendedCreditor[]> = of([]);
  selectCreditor: IExtendedCreditor | null = null;
  loading = false;
  totalItems: any;
  searchTerm: string | null = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;
  batchSize = 20;

  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly service = inject(CreditorService);
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.selectCreditor = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selectCreditor) {
      this.selectCreditor.order = this.i++;
      this.selectCreditor.orderForSort = -1;
    }

    if (this.parentForm.get(this.partnerControlName)!.value !== undefined && this.parentForm.get(this.partnerControlName)!.value !== null) {
      this._partner = this.parentForm.get(this.partnerControlName)!.value;
    }

    this.parentForm.get(this.partnerControlName)!.valueChanges.subscribe(value => {
      this._partner = value;
      console.log(this._partner);
      if (value === null || value === '' || value.id !== this.selectCreditor?.partnerId) {
        this.clear();
      }
    });

    const filter$ = this.parentForm.get(this.formInnerControlName)!.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      filter(q => typeof q === 'string' || q === null),
    );

    this.filteredData$ = filter$.pipe(
      switchMap((value: any) => {
        this.searchTerm = value;
        let currentPage = 0;
        this.i = 0;
        return this.incrementBatchOffset$.pipe(
          startWith(currentPage),
          exhaustMap(() => {
            return this.getList(value, currentPage);
          }),
          tap(gruppi => (this.countSelect = (this.countSelect ?? 0) + gruppi.length)),
          tap(() => (this.currentPage = ++currentPage)),
          takeWhile(p => p.length > 0, true),
          scan((allGroups: any[], newGroups: any[]) => {
            let i = 0;
            newGroups.forEach(group => {
              group.order = this.i++;
              group.orderForSort = group.order;
            });

            if (this.selectCreditor) {
              const foundIntoNewGroups = newGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectCreditor && this.selectCreditor.id),
              );
              const foundIntoAllGroups = allGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectCreditor && this.selectCreditor.id),
              );
              if (foundIntoNewGroups !== -1 && foundIntoAllGroups !== -1) {
                allGroups.splice(foundIntoAllGroups, 1);
              } else if (foundIntoNewGroups === -1 && foundIntoAllGroups === -1) {
                newGroups.push(this.selectCreditor);
              }
            }
            return allGroups.concat(newGroups);
          }, []),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getList(value: any, page: number): Observable<ICreditor[]> {
    return this.callService(value, page);
  }

  private callService(search: string, pageRequired: number): Observable<ICreditor[]> {
    this.loading = true;
    if (this._partner !== null && this._partner !== undefined && this._partner.id !== undefined && this._partner.id !== null) {
      const req: any = {
        page: pageRequired,
        size: ITEMS_PER_PAGE,
        sort: ['name,asc'],
      };
      addNumericToReq(this._partner.id, 'partnerId', req);
      return this.service.query(req).pipe(
        map((value: HttpResponse<ICreditor[]>) => {
          const stations = value.body || [];
          this.totalItems = Number(value.headers.get('X-Total-Count'));
          return stations;
        }),
        catchError(() => {
          return [];
        }),
        finalize(() => {
          this.loading = false;
        }),
      );
    } else {
      return of([]).pipe(
        finalize(() => {
          this.loading = false;
        }),
      );
    }
  }

  compareFn(obj1: IExtendedCreditor, obj2: IExtendedCreditor) {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selectCreditor = matSelectChange.value as IExtendedCreditor;
  }

  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }

  private clear(): void {
    this.countSelect = 0;
    this.selectCreditor = null;
    this.parentForm.get(this.formInnerControlName)!.setValue(null);
  }
}
