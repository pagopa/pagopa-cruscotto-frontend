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
import { StationService } from '../../service/station.service';
import { IStation } from '../../station.model';
import { PartnerService } from 'app/entity/partner/service/partner.service';

interface IExtendedStation extends Omit<IStation, ''> {
  order: number;
  orderForSort: number;
}

@Component({
  selector: 'jhi-station-select',
  templateUrl: './station-select.component.html',
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
export class StationSelectComponent implements OnInit, OnDestroy {
  @ViewChild('jhiSelectInfiniteScroll', { static: true })
  infiniteScrollSelect!: MatSelect;

  @Input() parentForm!: FormGroup;
  @Input() formInnerControlName!: string;

  // Use a BehaviorSubject to hold the current partner ID and emit its changes
  private currentPartnerIdSubject = new BehaviorSubject<number | null>(null);
  currentPartnerId$ = this.currentPartnerIdSubject.asObservable();
  first: boolean = true;
  filteredData$: Observable<IExtendedStation[]> = of([]);
  selectStation: IExtendedStation | null = null;
  loading = false;
  totalItems: any;
  searchTerm: string | null = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;

  ngOnInit() {
    this.selectStation = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selectStation) {
      this.selectStation.order = this.i++;
      this.selectStation.orderForSort = -1;
    }

    this.partnerService
      .getPartnerId()
      .pipe(
        takeUntil(this.destroy$),
        tap(partnerData => {
          if (partnerData.partnerId !== 'undefined') {
            console.log('received partner id :', partnerData.partnerId);
            const newPartnerId = partnerData.partnerId ? parseInt(partnerData.partnerId, 10) : null;
            this.currentPartnerIdSubject.next(newPartnerId);
            if (this.first) {
              this.first = false;
            } else {
              this.parentForm.get(this.formInnerControlName)?.setValue(null);
              this.selectStation = null;
            }
            this.fillStations();
          } else {
            this.parentForm.get(this.formInnerControlName)?.setValue(null);
            this.selectStation = null;
            this.filteredData$ = of([]);
          }
        }),
      )
      .subscribe();
  }

  batchSize = 20;
  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly stationService = inject(StationService);
  private readonly partnerService = inject(PartnerService);
  private destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getList(value: any, page: number, partnerId: number | null): Observable<IStation[]> {
    return this.callService(value, page, partnerId);
  }

  private callService(search: string, pageRequired: number, partnerId: number | null): Observable<IStation[]> {
    this.loading = true;
    const req: any = {
      page: pageRequired,
      size: ITEMS_PER_PAGE,
      sort: ['name,asc'],
    };
    if (partnerId !== null) {
      req.partnerId = partnerId;
    }
    return this.stationService.query(req).pipe(
      map((value: HttpResponse<IStation[]>) => {
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
  }

  fillStations() {
    // Combine the search term changes and the partner ID changes
    const filter$ = this.parentForm.get(this.formInnerControlName)!.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      filter(q => typeof q === 'string' || q === null),
    );

    this.filteredData$ = combineLatest([filter$, this.currentPartnerId$]).pipe(
      switchMap(([searchTerm, currentPartnerId]) => {
        this.searchTerm = searchTerm;
        let currentPage = 0;
        this.i = 0;
        return this.incrementBatchOffset$.pipe(
          startWith(currentPage),
          exhaustMap(() => {
            return this.getList(searchTerm, currentPage, currentPartnerId);
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

            if (this.selectStation) {
              const foundIntoNewGroups = newGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectStation && this.selectStation.id),
              );
              const foundIntoAllGroups = allGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectStation && this.selectStation.id),
              );
              if (foundIntoNewGroups !== -1 && foundIntoAllGroups !== -1) {
                allGroups.splice(foundIntoAllGroups, 1);
              } else if (foundIntoNewGroups === -1 && foundIntoAllGroups === -1) {
                newGroups.push(this.selectStation);
              }
            }
            return allGroups.concat(newGroups);
          }, []),
        );
      }),
    );
  }

  compareFn(obj1: IExtendedStation, obj2: IExtendedStation) {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selectStation = matSelectChange.value as IExtendedStation;
  }

  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }
}
