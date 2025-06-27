import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IPermission } from '../permission.model';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-auth-permission-detail',
  templateUrl: './permission-detail.component.html',
  imports: [SharedModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule],
})
export class PermissionDetailComponent implements OnInit {
  permission: IPermission | null = null;

  protected readonly Authority = Authority;

  protected readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permission }) => (this.permission = permission));
  }

  previousState(): void {
    window.history.back();
  }
}
