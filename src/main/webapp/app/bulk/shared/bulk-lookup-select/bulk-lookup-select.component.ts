import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Observable, debounceTime, distinctUntilChanged, finalize, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AnagCanale,
  AnagIntermediarioPa,
  AnagIntermediarioPsp,
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  PageDTO,
} from '../../models/bulk-search.model';
import { BulkLookupPageRequest, BulkLookupService } from '../../services/bulk-lookup.service';

type LookupOption = AnagPaEmittente | AnagPsp | AnagIntermediarioPa | AnagIntermediarioPsp | AnagStazione | AnagCanale | string;
export type BulkLookupType =
  | 'creditorInstitutions'
  | 'psp'
  | 'intermediaries'
  | 'intermediariesPsp'
  | 'stations'
  | 'channels'
  | 'paymentMethods';

@Component({
  selector: 'jhi-bulk-lookup-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ScrollingModule,
  ],
  templateUrl: './bulk-lookup-select.component.html',
  styleUrls: ['./bulk-lookup-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BulkLookupSelectComponent),
      multi: true,
    },
  ],
})
export class BulkLookupSelectComponent implements ControlValueAccessor, OnChanges, OnInit {
  @ViewChild('searchInput') private readonly searchInput?: ElementRef<HTMLInputElement>;

  @Input({ required: true }) label = '';
  @Input({ required: true }) lookupType!: BulkLookupType;
  @Input() initialOptions: LookupOption[] = [];
  @Input() initialHasMore = true;

  readonly searchControl = new FormControl('', { nonNullable: true });
  options: LookupOption[] = [];
  loading = false;
  hasMore = true;
  selected: LookupOption | null = null;
  disabled = false;

  private readonly lookupService = inject(BulkLookupService);
  private readonly destroyRef = inject(DestroyRef);
  private page = 0;
  private filter = '';
  private readonly pageSize = 20;
  private onChange: (value: LookupOption | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['initialOptions'] || changes['initialHasMore']) && !this.filter) {
      this.options = [...this.initialOptions];
      this.hasMore = this.initialHasMore;
    }
  }

  ngOnInit(): void {
    this.options = [...this.initialOptions];
    this.hasMore = this.initialHasMore;
    this.searchControl.valueChanges
      .pipe(
        map(value => value.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(filter => {
          this.filter = filter;
          this.page = 0;
          this.loading = true;
          return this.getPage({ page: 0, size: this.pageSize, search: filter }).pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(response => this.replaceOptions(response));
  }

  displayOption = (option: LookupOption | null): string => {
    if (!option) {
      return '';
    }

    if (typeof option === 'string') {
      return option;
    }

    return [option.codice].filter(Boolean).join(' - ');
  };

  trackByOption = (_index: number, option: LookupOption): number | string | undefined => (typeof option === 'string' ? option : option.id);

  writeValue(value: LookupOption | null): void {
    this.selected = value;
    this.searchControl.setValue('', { emitEvent: false });
  }

  registerOnChange(fn: (value: LookupOption | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  select(option: LookupOption | null): void {
    if (!option) {
      return;
    }
    this.selected = option;
    this.onChange(option);
    this.onTouched();
  }

  clear(): void {
    this.selected = null;
    this.onChange(null);
    this.onTouched();
  }

  onOpenedChange(isOpen: boolean): void {
    if (!isOpen) {
      return;
    }

    queueMicrotask(() => {
      this.searchInput?.nativeElement.focus();
      this.searchInput?.nativeElement.select();
    });
  }

  loadNextPage(viewport: CdkVirtualScrollViewport): void {
    if (this.loading || !this.hasMore || viewport.getRenderedRange().end < this.options.length - 5) {
      return;
    }

    this.loading = true;
    this.getPage({ page: this.page + 1, size: this.pageSize, search: this.filter })
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(response => {
        this.page += 1;
        this.options = [...this.options, ...(response.content ?? [])];
        this.hasMore = !response.last && (response.content?.length ?? 0) > 0;
      });
  }

  private getPage(request: BulkLookupPageRequest): Observable<PageDTO<LookupOption>> {
    switch (this.lookupType) {
      case 'creditorInstitutions':
        return this.lookupService.creditorInstitutions(request) as Observable<PageDTO<LookupOption>>;
      case 'psp':
        return this.lookupService.psp(request) as Observable<PageDTO<LookupOption>>;
      case 'intermediaries':
        return this.lookupService.intermediaries(request) as Observable<PageDTO<LookupOption>>;
      case 'intermediariesPsp':
        return this.lookupService.intermediariesPsp(request) as Observable<PageDTO<LookupOption>>;
      case 'stations':
        return this.lookupService.stations(request) as Observable<PageDTO<LookupOption>>;
      case 'channels':
        return this.lookupService.channels(request) as Observable<PageDTO<LookupOption>>;
      case 'paymentMethods':
        return this.lookupService.paymentMethods(request) as Observable<PageDTO<LookupOption>>;
    }
  }

  private replaceOptions(response: PageDTO<LookupOption>): void {
    this.options = response.content ?? [];
    this.hasMore = !response.last && this.options.length > 0;
  }
}
