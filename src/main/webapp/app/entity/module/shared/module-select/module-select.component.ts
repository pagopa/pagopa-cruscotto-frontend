import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, exhaustMap, filter, finalize, map, scan, startWith, switchMap, takeWhile, tap } from 'rxjs/operators';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import SharedModule from '../../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectInfiniteScrollDirective } from '../../../../shared/directives/mat-select-infinite-scroll.directive';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { HttpResponse } from '@angular/common/http';
import { addStringToReq } from '../../../../shared/pagination/filter-util.pagination';
import { IModule } from '../../module.model';
import { ModuleService } from '../../service/module.service';

interface IExtendModule extends Omit<IModule, ''> {
  order: number;
  orderForSort: number;
}

@Component({
  selector: 'jhi-module-select',
  templateUrl: './module-select.component.html',
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
export class ModuleSelectComponent implements OnInit, OnDestroy {
  @ViewChild('jhiSelectInfiniteScroll', { static: true })
  infiniteScrollSelect!: MatSelect;

  @Input() parentForm!: FormGroup;
  @Input() formInnerControlName!: string;
  @Output() changeSelected = new EventEmitter<IModule>();

  public moduleFilteringCtrl: FormControl<string | null> = new FormControl<string>('');

  public searching = false;

  protected module: IExtendModule[] = [];

  filteredData$: Observable<IExtendModule[]> = of([]);
  selectModule: IExtendModule | null = null;
  loading = false;
  totalItems: any;
  searchTerm = null;
  countSelect = 0;
  currentPage = 0;
  i = 0;

  ngOnInit() {
    this.selectModule = this.parentForm.get(this.formInnerControlName)?.value ?? null;
    if (this.selectModule) {
      this.selectModule.order = this.i++;
      this.selectModule.orderForSort = -1;
    }

    const filter$ = this.moduleFilteringCtrl.valueChanges.pipe(
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
          tap(modules => (this.countSelect = (this.countSelect ?? 0) + modules.length)),
          tap(() => (this.currentPage = ++currentPage)),
          tap(() => (this.searching = false)),
          /** Note: This is a custom operator because we also need the last emitted value.
           Note: Stop if there are no more pages, or no results at all for the current search text.
           */
          takeWhile(p => {
            return p.length > 0;
          }, true),
          scan((allModules: any[], newModules: any[]) => {
            let i = 0;

            newModules.forEach(module => {
              module.order = this.i++;
              module.orderForSort = module.order;
            });

            if (this.selectModule) {
              const foundIntoNewModules = newModules.findIndex(
                (module: { id: any }) => module.id === (this.selectModule && this.selectModule.id),
              );
              const foundIntoAllModules = allModules.findIndex(
                (module: { id: any }) => module.id === (this.selectModule && this.selectModule.id),
              );
              if (foundIntoNewModules !== -1 && foundIntoAllModules !== -1) {
                allModules.splice(foundIntoAllModules, 1);
              } else if (foundIntoNewModules === -1 && foundIntoAllModules === -1) {
                newModules.push(this.selectModule);
              }
            }
            return allModules.concat(newModules);
          }, []),
        );
      }),
    );
  }

  /** Number of items added per batch */
  batchSize = 20;
  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private readonly moduleService = inject(ModuleService);
  private destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getList(value: any, page: number): Observable<IModule[]> {
    return this.callService(value, page);
  }

  private callService(search: string, pageRequired: number): Observable<IModule[]> {
    this.loading = true;
    const req = {
      page: pageRequired,
      size: ITEMS_PER_PAGE,
      sort: ['code,asc'],
    };

    addStringToReq(search, 'name', req);

    return this.moduleService.query(req).pipe(
      map((value: HttpResponse<IModule[]>) => {
        const modules = value.body || [];
        this.totalItems = Number(value.headers.get('X-Total-Count'));
        return modules;
      }),
      catchError(() => {
        return [];
      }),
      finalize(() => {
        this.loading = false;
      }),
    );
  }

  compareFn(obj1: IExtendModule, obj2: IExtendModule) {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  selectionChange(matSelectChange: MatSelectChange): void {
    this.selectModule = matSelectChange.value as IExtendModule;
    this.changeSelected.emit(this.selectModule);
  }

  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }
}
