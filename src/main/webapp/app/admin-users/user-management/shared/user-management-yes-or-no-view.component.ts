import { Component, input } from '@angular/core';
import SharedModule from '../../../shared/shared.module';

@Component({
  selector: 'jhi-user-management-yes-or-no-view',
  template: `
    <span class="badge bg-danger p-2" *ngIf="yesOrNo()" jhiTranslate="values.yes">Si</span>
    <span class="badge bg-success p-2" *ngIf="!yesOrNo()" jhiTranslate="values.no">No</span>
  `,
  imports: [SharedModule],
})
export class UserManagementYesOrNoViewComponent {
  yesOrNo = input<boolean>();
}
