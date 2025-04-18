import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IGroup } from '../group.model';
import { GroupAssignableFunctionsComponent } from './group.assignable-functions.component';
import { GroupAssociatedFunctionsComponent } from './group.associated-functions.component';

@Component({
  selector: 'jhi-auth-group-manage-functions',
  templateUrl: './group.manage-functions.component.html',
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    GroupAssignableFunctionsComponent,
    GroupAssociatedFunctionsComponent,
  ],
})
export class GroupManageFunctionsComponent implements OnInit {
  group: IGroup | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authGroup }) => {
      this.group = authGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
