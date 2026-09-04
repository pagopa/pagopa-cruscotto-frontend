import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollService {
  private threshold = '15%';
  private debounceTime = 150;
  private complete!: boolean;
  private thrPx = 0;
  private thrPc = 0;
  private destroyed$ = new Subject<void>();
  private selectItemHeightPx!: number;
  private panel!: Element;

  constructor(private ngZone: NgZone) {}

  initialize(
    panel: Element,
    selectItemHeightPx: number,
    config: {
      threshold: string;
      debounceTime: number;
      complete: boolean;
    },
  ): void {
    this.threshold = config.threshold;
    this.debounceTime = config.debounceTime;
    this.complete = config.complete;

    this.panel = panel;
    this.selectItemHeightPx = selectItemHeightPx;
    this.evaluateThreshold();
  }

  evaluateThreshold(): void {
    if (this.threshold.lastIndexOf('%') > -1) {
      this.thrPx = 0;
      this.thrPc = parseFloat(this.threshold) / 100;
    } else {
      this.thrPx = parseFloat(this.threshold);
      this.thrPc = 0;
    }
  }

  registerScrollListener(infiniteScrollCallback: () => void): void {
    fromEvent(this.panel, 'scroll')
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(this.debounceTime),
        tap(event => {
          this.handleScrollEvent(event, infiniteScrollCallback);
        }),
      )
      .subscribe();
  }

  handleScrollEvent(event: any, infiniteScrollCallback: () => void): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.complete) {
        return;
      }
      const countOfRenderedOptions = Math.round(this.panel.scrollHeight / this.selectItemHeightPx);
      const infiniteScrollDistance = this.selectItemHeightPx * countOfRenderedOptions;
      const threshold = this.thrPc !== 0 ? infiniteScrollDistance * this.thrPc : this.thrPx;

      const scrolledDistance: number = this.panel.clientHeight + Number(event.target.scrollTop);

      if (scrolledDistance + threshold >= infiniteScrollDistance) {
        this.ngZone.run(infiniteScrollCallback);
      }
    });
  }

  destroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
