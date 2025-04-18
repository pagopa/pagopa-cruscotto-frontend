import { Component, input } from '@angular/core';
import SharedModule from '../../../shared/shared.module';

@Component({
  selector: 'jhi-user-management-group-view',
  template: ` <span class="badge bg-info p-2">{{ group() }}</span> `,
  imports: [SharedModule],
})
export class UserManagementGroupViewComponent {
  group = input<string>();
}
