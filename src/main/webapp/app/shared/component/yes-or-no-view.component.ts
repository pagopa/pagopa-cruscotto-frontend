import { Component, input } from '@angular/core';
import SharedModule from '../shared.module';

@Component({
  selector: 'jhi-yes-or-no-view',
  template: `
    <span class="badge bg-success p-2" *ngIf="yesOrNo() !== null && yesOrNo()" jhiTranslate="values.yes">Si</span>
    <span class="badge bg-danger p-2" *ngIf="yesOrNo() !== null && !yesOrNo()" jhiTranslate="values.no">No</span>
  `,
  imports: [SharedModule],
})
export class YesOrNoViewComponent {
  yesOrNo = input<boolean | null>();
}
