import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BulkSearchService } from '../../services/bulk-search.service';

import { BulkCsvValidationError, RICERCA_MASSIVA_CSV_TUTORIAL_TYPES } from '../ricerca-massiva.mock';

@Component({
  selector: 'jhi-ricerca-massiva-csv-upload',
  standalone: true,
  template: `
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="mb-1">Nuova istanza da CSV</h2>
        </div>
        <button type="button" mat-flat-button (click)="previousState()">
          <mat-icon fontSet="material-symbols-outlined">undo</mat-icon>
          <span>Indietro</span>
        </button>
      </div>

      <mat-card class="mb-4">
        <mat-card-content>
          <h3 class="mb-3">File supportati</h3>
          <p class="mb-4 text-muted">
            L’importazione CSV supporta cinque tipologie di file. Verifica che il testo del tuo file corrisponda a uno dei formati descritti
            di seguito prima di inviare la richiesta.
          </p>

          <div class="row g-3">
            @for (type of tutorialTypes; track type.title) {
              <div class="col-lg-6">
                <div class="border rounded p-3 h-100">
                  <div class="fw-semibold mb-2">{{ type.title }}</div>
                  <code class="d-block bg-light rounded px-2 py-2 text-break">{{ type.sample }}</code>
                </div>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
            <div>
              <h3 class="mb-1">Seleziona il file</h3>
              <small class="text-muted">Supporta solo file CSV validi.</small>
            </div>
            <button type="button" mat-flat-button color="primary" (click)="fileInput.click()">
              <mat-icon fontSet="material-symbols-outlined">upload_file</mat-icon>
              <span>Scegli file</span>
            </button>
          </div>

          <input #fileInput type="file" accept=".csv,text/csv" hidden (change)="onFileSelected(fileInput)" />

          @if (selectedFileName) {
            <div class="alert alert-light border mb-3"><strong>File selezionato:</strong> {{ selectedFileName }}</div>

            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Nome istanza</mat-label>
              <input matInput [(ngModel)]="instanceName" maxlength="100" placeholder="Nome del file se lasciato vuoto" />
            </mat-form-field>

            <div class="mb-3">
              <label class="form-label fw-semibold">Anteprima CSV</label>
              <textarea class="form-control" rows="8" [value]="csvPreview" readonly></textarea>
              <small class="text-muted d-block mt-2">Anteprima limitata alle prime 10 righe, incluso l'intestazione.</small>
            </div>
          }

          @if (selectedFileName && validationRequested) {
            @if (validationErrors.length) {
              <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading mb-3">Errori di validazione del file</h4>
                <ul class="mb-0 ps-3">
                  @for (error of validationErrors; track error.row + error.column) {
                    <li>
                      <strong>Riga {{ error.row }}</strong> · {{ error.column }}: {{ error.message }}
                    </li>
                  }
                </ul>
              </div>
            } @else {
              <div class="alert alert-success" role="alert">Il file rispetta il formato richiesto e può essere inviato.</div>
            }
          }
        </mat-card-content>

        <div class="d-flex justify-content-end p-3 pt-0 gap-2">
          <button type="button" mat-stroked-button (click)="validateCsv()" [disabled]="!selectedFileName || isValidating">
            <mat-icon fontSet="material-symbols-outlined">rule</mat-icon>
            <span>{{ isValidating ? 'Validazione...' : 'Valida CSV' }}</span>
          </button>
          <button type="button" mat-flat-button color="primary" [disabled]="!canSubmit || isValidating || isSubmitting" (click)="submit()">
            <mat-icon fontSet="material-symbols-outlined">send</mat-icon>
            <span>{{ isSubmitting ? 'Invio...' : 'Invia richiesta' }}</span>
          </button>
        </div>
        @if (submitError) {
          <div class="alert alert-danger mx-3 mb-3" role="alert">Impossibile creare l'istanza.</div>
        }
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      code {
        font-size: 0.85rem;
      }
    `,
  ],
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule],
})
export class RicercaMassivaCsvUploadComponent {
  readonly tutorialTypes = RICERCA_MASSIVA_CSV_TUTORIAL_TYPES;

  selectedFileName = '';
  csvPreview = '';
  validationRequested = false;
  hasValidated = false;
  isValidating = false;
  validationErrors: BulkCsvValidationError[] = [];
  canSubmit = false;
  instanceName = '';
  isSubmitting = false;
  submitError = false;

  private readonly router = inject(Router);
  private readonly bulkSearchService = inject(BulkSearchService);
  private currentCsvBlob: Blob | null = null;
  private validatedCsvBlob: Blob | null = null;

  previousState(): void {
    void this.router.navigate(['/bulk/ricerca-massiva']);
  }

  onFileSelected(fileInput: HTMLInputElement): void {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    this.selectedFileName = file ? file.name : '';
    this.csvPreview = '';
    this.validationRequested = false;
    this.hasValidated = false;
    this.validationErrors = [];
    this.canSubmit = false;
    this.instanceName = '';
    this.submitError = false;
    this.validatedCsvBlob = null;
    this.currentCsvBlob = null;

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      this.csvPreview = this.extractPreview(content);
      this.currentCsvBlob = file;
    };
    reader.readAsText(file);
  }

  onCsvPreviewChanged(value: string): void {
    this.csvPreview = value;
    this.validationRequested = false;
    this.hasValidated = false;
    this.validationErrors = [];
    this.canSubmit = false;
    this.submitError = false;
    this.validatedCsvBlob = null;
    this.refreshCurrentCsvBlob();
  }

  private refreshCurrentCsvBlob(): void {
    this.currentCsvBlob = new Blob([this.csvPreview], { type: 'text/csv;charset=utf-8' });
  }

  private extractPreview(content: string): string {
    const rows = content
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(row => row.trimEnd())
      .filter(row => row.length > 0);

    if (rows.length === 0) {
      return '';
    }

    return rows.slice(0, 10).join('\n');
  }

  validateCsv(): void {
    if (!this.currentCsvBlob) {
      return;
    }

    this.isValidating = true;
    this.validationRequested = true;
    this.hasValidated = false;
    this.validationErrors = [];
    this.canSubmit = false;
    this.submitError = false;
    this.validatedCsvBlob = null;

    this.bulkSearchService.validateCsvFile(this.currentCsvBlob).subscribe({
      next: result => {
        this.validationErrors = (result?.errors ?? []).map(error => ({
          row: error.lineNumber ?? 0,
          column: error.column ?? '',
          message: error.message ?? '',
        }));
        this.canSubmit = result?.valid !== false;
        this.hasValidated = true;
        this.validatedCsvBlob = this.canSubmit ? this.currentCsvBlob : null;
        this.isValidating = false;
      },
      error: () => {
        this.validationErrors = [{ row: 0, column: '', message: 'Impossibile validare il file CSV.' }];
        this.hasValidated = true;
        this.isValidating = false;
      },
    });
  }

  submit(): void {
    if (!this.canSubmit || !this.validatedCsvBlob || this.isSubmitting) {
      return;
    }

    const fileToSubmit = new File([this.validatedCsvBlob], this.selectedFileName, { type: 'text/csv;charset=utf-8' });
    if (fileToSubmit.size === 0) {
      return;
    }

    const name = this.instanceName.trim() || this.selectedFileName;
    this.isSubmitting = true;
    this.submitError = false;
    this.bulkSearchService.createFromCsv(name, fileToSubmit).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/bulk/ricerca-massiva']);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = true;
      },
    });
  }
}
