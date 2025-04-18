import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
  selector: 'input[jhiRestrictNumbers]',
})
export default class NumberRestrictDirective {
  @Output() valueChange = new EventEmitter();

  private readonly elementRef = inject(ElementRef);

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const initialValue = this.elementRef.nativeElement.value;
    const newValue = initialValue.replace(/[^0-9]*/g, '');
    this.elementRef.nativeElement.value = newValue;
    this.valueChange.emit(newValue);
    if (initialValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
