import { Component, input } from '@angular/core';
import SharedModule from '../../../shared/shared.module';

@Component({
  selector: 'jhi-instance-state-view',
  template: ` <span class="badge bg-info p-2">{{ 'pagopaCruscottoApp.instanceState.' + status() | translate }}</span> `,
  imports: [SharedModule],
})
export class InstanceStateViewComponent {
  status = input<string>();
}
