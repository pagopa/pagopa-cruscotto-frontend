import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IFunction } from '../function.model';
import { FunctionAssociatedPermissionsComponent } from './function.associated-permissions.component';
import { FunctionAssignablePermissionsComponent } from './function.assignable-permissions.component';

@Component({
  selector: 'jhi-auth-function-manage-permissions',
  templateUrl: './function.manage-permissions.component.html',
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FunctionAssociatedPermissionsComponent,
    FunctionAssignablePermissionsComponent,
  ],
})
export class FunctionManagePermissionsComponent implements OnInit {
  function: IFunction | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authFunction }) => {
      this.function = authFunction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
