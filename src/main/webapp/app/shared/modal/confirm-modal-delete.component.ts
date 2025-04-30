import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalOptions } from './confirm-modal-options.model';
import { ModalResult } from './modal-results.enum';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import SharedModule from '../shared.module';

@Component({
  selector: 'jhi-confirm-modal-delete',
  templateUrl: './confirm-modal-delete.component.html',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, SharedModule],
})
export class ConfirmModalDeleteComponent implements OnInit {
  options!: ConfirmModalOptions;
  title!: string;
  body!: string;

  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<ConfirmModalDeleteComponent>,
  ) {}

  ngOnInit(): void {
    this.title = this.translateService.instant(this.options.title, this.options.titleParams);
    this.body = this.translateService.instant(this.options.body, this.options.bodyParams);
  }

  confirm(): void {
    this.dialogRef.close(ModalResult.CONFIRMED);
  }

  cancel(): void {
    this.dialogRef.close(ModalResult.REJECTED);
  }

  close(): void {
    this.dialogRef.close(ModalResult.CLOSED);
  }
}
