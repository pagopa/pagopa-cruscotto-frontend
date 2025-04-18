import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IFunction } from '../function.model';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';

@Component({
  selector: 'jhi-auth-function-detail',
  templateUrl: './function-detail.component.html',
  imports: [SharedModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule, MatListModule, MatLineModule],
})
export class FunctionDetailComponent implements OnInit {
  function: IFunction | null = null;

  protected readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authFunction }) => (this.function = authFunction));
  }

  previousState(): void {
    window.history.back();
  }
}
