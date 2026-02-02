import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'jhi-confirm-modal-save',
  template: './confirm-modal-save.component.html',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class ConfirmModalSaveComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ConfirmModalSaveComponent>);

  ngOnInit(): void {}

  confirm(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
