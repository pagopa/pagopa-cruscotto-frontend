import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmModalOptions } from './confirm-modal-options.model';
import { ModalResult } from './modal-results.enum';
import { ConfirmModalDeleteComponent } from './confirm-modal-delete.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModalSaveComponent } from './confirm-modal-save.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private modalResultSubject = new Subject<ModalResult>();

  constructor(public dialog: MatDialog) {}

  public delete(matDialogConfig: MatDialogConfig, confirmOptions: ConfirmModalOptions): Observable<ModalResult> {
    const config = {
      ...matDialogConfig,
      disableClose: true,
      autoFocus: 'dialog',
      restoreFocus: true,
      delayFocusTrap: true,
    };

    const modal = this.dialog.open(ConfirmModalDeleteComponent, config);
    modal.componentInstance.options = confirmOptions;
    modal.afterClosed().subscribe(result => this.modalResultSubject.next(result));

    return this.modalResultSubject.asObservable();
  }

  public save(matDialogConfig: MatDialogConfig, confirmOptions: ConfirmModalOptions): Observable<ModalResult> {
    const config = {
      ...matDialogConfig,
      disableClose: true,
      autoFocus: 'dialog',
      restoreFocus: true,
      delayFocusTrap: true,
    };

    const modal = this.dialog.open(ConfirmModalSaveComponent, config);
    modal.componentInstance.options = confirmOptions;
    modal.afterClosed().subscribe(result => this.modalResultSubject.next(result));

    return this.modalResultSubject.asObservable();
  }
}
