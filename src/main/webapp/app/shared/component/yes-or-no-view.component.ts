import { Component, input } from '@angular/core';
import SharedModule from '../shared.module';

@Component({
  selector: 'jhi-yes-or-no-view',
  template: `
    <span class="text-success fw-bold fs-6" *ngIf="yesOrNo() !== null && yesOrNo()" jhiTranslate="values.yes">Si</span>
    <span class="text-danger fw-bold fs-6" *ngIf="yesOrNo() !== null && !yesOrNo()" jhiTranslate="values.no">No</span>
  `,
  imports: [SharedModule],
})
export class YesOrNoViewComponent {
  yesOrNo = input<boolean | null>();
}
