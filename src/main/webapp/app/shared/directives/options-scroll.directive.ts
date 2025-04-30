import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
  autoComplete: MatAutocomplete;
  scrollEvent: Event;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-autocomplete[optionsScroll]',
})
export default class OptionsScrollDirective implements OnDestroy {
  @Input()
  thresholdPercent = 0.8;

  @Output()
  optionsScroll = new EventEmitter<IAutoCompleteScrollEvent>();

  _onDestroy = new Subject();

  constructor(public autoComplete: MatAutocomplete) {
    this.autoComplete.opened
      .pipe(
        tap(() => {
          /** Note: When autocomplete raises opened, panel is not yet created (by Overlay)
         Note: The panel will be available on next tick
         Note: The panel wil NOT open if there are no options to display
         */
          setTimeout(() => {
            /** Note: remove listner just for safety, in case the close event is skipped. */
            this.removeScrollEventListener();
            this.autoComplete.panel.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
          });
        }),
        takeUntil(this._onDestroy),
      )
      .subscribe();

    this.autoComplete.closed
      .pipe(
        tap(() => this.removeScrollEventListener()),
        takeUntil(this._onDestroy),
      )
      .subscribe();
  }

  onScroll(event: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.thresholdPercent === undefined) {
      this.optionsScroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
    } else {
      const threshold = (this.thresholdPercent * 100 * event.target.scrollHeight) / 100;
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const current = event.target.scrollTop + event.target.clientHeight;
      if (current > threshold) {
        this.optionsScroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
      }
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next(null);
    this._onDestroy.complete();
    this.removeScrollEventListener();
  }

  private removeScrollEventListener(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.autoComplete.panel) {
      this.autoComplete.panel.nativeElement.removeEventListener('scroll', this.onScroll);
    }
  }
}
