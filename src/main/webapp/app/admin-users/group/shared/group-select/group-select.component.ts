import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, exhaustMap, filter, finalize, map, scan, startWith, switchMap, takeWhile, tap } from 'rxjs/operators';
import { MatOption, MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import SharedModule from '../../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectInfiniteScrollDirective } from '../../../../shared/directives/mat-select-infinite-scroll.directive';
import { IGroup } from '../../group.model';
import { GroupService } from '../../service/group.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { HttpResponse } from '@angular/common/http';

interface IExtendGroup extends Omit<IGroup, ''> {
  order: number;
  orderForSort: number;
}

@Component({
  selector: 'jhi-group-select',
  templateUrl: './group-select.component.html',
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
export class GroupSelectComponent implements OnInit, OnDestroy {
  @ViewChild('jhiSelectInfiniteScroll', { static: true })
  infiniteScrollSelect!: MatSelect;

  @Input() parentForm!: FormGroup;

  @Input() formInnerControlName!: string;

  filteredData$: Observable<IExtendGroup[]> = of([]);

  selectGroup: IExtendGroup | null = null;

  loading = false;
  totalItems: any;
  searchTerm = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;

  ngOnInit() {
    this.selectGroup = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selectGroup) {
      this.selectGroup.order = this.i++;
      this.selectGroup.orderForSort = -1;
    }

    const filter$ = this.parentForm.get(this.formInnerControlName)!.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      filter(q => typeof q === 'string' || q === null),
    );

    this.filteredData$ = filter$.pipe(
      switchMap((value: any) => {
        this.searchTerm = value;
        // Note: Reset the page with every new seach text
        let currentPage = 0;
        this.i = 0;
        return this.incrementBatchOffset$.pipe(
          startWith(currentPage),
          // Note: Until the backend responds, ignore NextPage requests.
          exhaustMap(() => {
            return this.getList(value, currentPage);
          }),
          tap(gruppi => (this.countSelect = (this.countSelect ?? 0) + gruppi.length)),
          tap(() => (this.currentPage = ++currentPage)),
          /** Note: This is a custom operator because we also need the last emitted value.
           Note: Stop if there are no more pages, or no results at all for the current search text.
           */
          takeWhile(p => {
            return p.length > 0;
          }, true),
          scan((allGroups: any[], newGroups: any[]) => {
            let i = 0;

            newGroups.forEach(group => {
              group.order = this.i++;
              group.orderForSort = group.order;
            });

            if (this.selectGroup) {
              const foundIntoNewGroups = newGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectGroup && this.selectGroup.id),
              );
              const foundIntoAllGroups = allGroups.findIndex(
                (group: { id: any }) => group.id === (this.selectGroup && this.selectGroup.id),
              );
              if (foundIntoNewGroups !== -1 && foundIntoAllGroups !== -1) {
                allGroups.splice(foundIntoAllGroups, 1);
              } else if (foundIntoNewGroups === -1 && foundIntoAllGroups === -1) {
                newGroups.push(this.selectGroup);
              }
            }

            return allGroups.concat(newGroups);
          }, []),
        );
      }),
    );
  }

  /** Number of items added per batch */
  batchSize = 20;

  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly groupService = inject(GroupService);

  private destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
  }

  getList(value: any, page: number): Observable<IGroup[]> {
    return this.callService(value, page);
  }

  private callService(search: string, pageRequired: number): Observable<IGroup[]> {
    this.loading = true;

    const req = {
      page: pageRequired,
      size: ITEMS_PER_PAGE,
      sort: ['descrizione,asc'],
    };

    return this.groupService.query(req).pipe(
      map((value: HttpResponse<IGroup[]>) => {
        const groups = value.body || [];
        this.totalItems = Number(value.headers.get('X-Total-Count'));
        return groups;
      }),
      catchError(() => {
        return [];
      }),
      finalize(() => {
        this.loading = false;
      }),
    );
  }

  compareFn(obj1: IExtendGroup, obj2: IExtendGroup) {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selectGroup = matSelectChange.value as IExtendGroup;
  }

  // private sortFn(n1:IExtendGroup ,n2:IExtendGroup): number {
  //   if (n1.orderForSort > n2.orderForSort) {
  //     return 1;
  //   }
  //
  //   if (n1.orderForSort < n2.orderForSort) {
  //     return -1;
  //   }
  //
  //   return 0;
  // }

  /**
   * Load the next batch
   */
  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }
}
