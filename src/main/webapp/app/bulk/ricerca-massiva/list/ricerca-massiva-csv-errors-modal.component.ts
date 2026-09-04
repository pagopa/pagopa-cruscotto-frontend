import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import SharedModule from '../../../shared/shared.module';
import { BulkCsvValidationError } from '../ricerca-massiva.mock';

@Component({
  selector: 'jhi-ricerca-massiva-csv-errors-modal',
  standalone: true,
  imports: [SharedModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon fontSet="material-symbols-outlined" color="warn">error</mat-icon>
      Errori di validazione CSV
    </h2>
    <mat-dialog-content>
      <p>Il file contiene i seguenti errori:</p>
      <ul>
        @for (error of data; track error.row + '-' + error.column) {
          <li>
            <strong>Riga {{ error.row }}, colonna {{ error.column }}</strong
            >: {{ error.message }}
          </li>
        }
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" type="button" (click)="close()">Chiudi</button>
    </mat-dialog-actions>
  `,
})
export class RicercaMassivaCsvErrorsModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: BulkCsvValidationError[],
    private readonly dialogRef: MatDialogRef<RicercaMassivaCsvErrorsModalComponent>,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
