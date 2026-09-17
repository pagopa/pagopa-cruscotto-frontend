import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BulkSearchService } from '../../services/bulk-search.service';

import { CsvValidationError } from '../../models/bulk-search.model';
import { RICERCA_MASSIVA_CSV_TUTORIAL_TYPES } from '../ricerca-massiva.mock';

@Component({
  selector: 'jhi-ricerca-massiva-csv-upload',
  standalone: true,
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="mb-1">Nuova istanza da CSV</h2>
      </div>
      <button type="button" mat-flat-button (click)="previousState()">
        <mat-icon fontSet="material-symbols-outlined">undo</mat-icon>
        <span>Indietro</span>
      </button>
    </div>

    <mat-card class="mb-4 info-box">
      <mat-card-content>
        <p class="info-copy mb-3">
          I file accettati seguono un set definito di intestazioni e campi. Controlla il layout più adatto al tuo caso prima di caricare il
          CSV.
        </p>
        <div class="mx-4">
          <mat-accordion multi="false">
            @for (type of tutorialTypes; track type.title; let first = $first) {
              <mat-expansion-panel class="example-panel" [expanded]="first">
                <mat-expansion-panel-header>
                  <mat-panel-title>{{ type.title }}</mat-panel-title>
                </mat-expansion-panel-header>

                <div class="sample-shell">
                  <code>{{ type.sample }}</code>
                </div>
              </mat-expansion-panel>
            }
          </mat-accordion>
        </div>
      </mat-card-content>
    </mat-card>
    <mat-card class="upload-box">
      <mat-card-content>
        <div class="upload-header">
          <button type="button" mat-stroked-button (click)="fileInput.click()">
            <mat-icon fontSet="material-symbols-outlined">upload_file</mat-icon>
            <span>Scegli file</span>
          </button>
        </div>

        <input #fileInput type="file" accept=".csv,text/csv" hidden (change)="onFileSelected(fileInput)" />

        <div class="upload-body">
          @if (selectedFileName) {
            <div class="selection-box"><strong>File selezionato:</strong> {{ selectedFileName }}</div>

            <div class="preview-box">
              <div class="preview-label">Anteprima CSV</div>
              <textarea class="form-control" rows="8" [value]="csvPreview" readonly></textarea>
              <small class="text-muted d-block mt-2">Anteprima limitata alle prime 10 righe, incluso l'intestazione.</small>
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon fontSet="material-symbols-outlined">description</mat-icon>
              <span>Nessun file caricato. Seleziona un CSV valido per iniziare.</span>
            </div>
          }

          @if (selectedFileName && validationRequested) {
            @if (validationErrors.length) {
              <div class="alert alert-danger mt-3" role="alert">
                <h4 class="alert-heading mb-3">Errori di validazione</h4>
                @if (validationSummary) {
                  <p class="mb-3 text-muted">{{ validationSummary }}</p>
                }
                <ul class="mb-0 ps-3">
                  @for (error of visibleValidationErrors; track error.lineNumber + error.column + error.message) {
                    <li>
                      <strong>Riga {{ error.lineNumber }}</strong> · {{ error.column || 'campo' }}: {{ error.message }}
                    </li>
                  }
                  @if (remainingErrorsCount > 0) {
                    <li class="text-muted">Altri {{ remainingErrorsCount }} errore{{ remainingErrorsCount === 1 ? '' : 'i' }}.</li>
                  }
                </ul>
              </div>
            } @else {
              <div class="alert alert-success mt-3" role="alert">
                @if (validationSummary) {
                  {{ validationSummary }}
                } @else {
                  Il file rispetta il formato richiesto e può essere inviato.
                }
              </div>
            }
          }
        </div>
      </mat-card-content>

      <div class="d-flex justify-content-end p-3 pt-0 gap-2">
        <button
          type="button"
          class="validate-button"
          mat-stroked-button
          (click)="validateCsv()"
          [disabled]="!selectedFileName || isValidating"
        >
          <mat-icon fontSet="material-symbols-outlined">rule</mat-icon>
          <span>{{ isValidating ? 'Validazione...' : 'Valida CSV' }}</span>
        </button>
        <button type="button" mat-flat-button [disabled]="!canSubmit || isValidating || isSubmitting" (click)="submit()">
          <mat-icon fontSet="material-symbols-outlined">send</mat-icon>
          <span>{{ isSubmitting ? 'Invio...' : 'Invia richiesta' }}</span>
        </button>
      </div>
      @if (submitError) {
        <div class="alert alert-danger mx-3 mb-3" role="alert">Impossibile creare l'istanza.</div>
      }
    </mat-card>
  `,
  styles: [
    `
      .info-copy {
        margin: 0;
        color: rgba(0, 0, 0, 0.7);
        line-height: 1.5;
      }

      code {
        white-space: pre-wrap;
      }

      .selection-box,
      .empty-state,
      .preview-box {
        margin: 12px 0;
        background: #fff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 8px;
      }

      .selection-box {
        padding: 0.8rem 0.9rem;
        color: rgba(0, 0, 0, 0.8);
      }

      .empty-state {
        display: flex;
        align-items: center;
        padding: 0.9rem 1rem;
        color: rgba(0, 0, 0, 0.7);
      }

      .preview-box {
        padding: 0.8rem 0.9rem 0.9rem;
      }

      .preview-label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
      }

      textarea {
        resize: vertical;
        min-height: 170px;
        background: #fff;
      }

      .validate-button {
        border-color: rgba(0, 0, 0, 0.2) !important;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class RicercaMassivaCsvUploadComponent {
  readonly tutorialTypes = RICERCA_MASSIVA_CSV_TUTORIAL_TYPES;

  selectedFileName = '';
  csvPreview = '';
  validationRequested = false;
  hasValidated = false;
  isValidating = false;
  validationErrors: CsvValidationError[] = [];
  validationSummary = '';
  canSubmit = false;
  instanceName = '';
  isSubmitting = false;
  submitError = false;

  get visibleValidationErrors(): CsvValidationError[] {
    return this.validationErrors.slice(0, 3);
  }

  get remainingErrorsCount(): number {
    return Math.max(this.validationErrors.length - 3, 0);
  }

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
    this.validationSummary = '';
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
    this.validationSummary = '';
    this.canSubmit = false;
    this.submitError = false;
    this.validatedCsvBlob = null;
    this.refreshCurrentCsvBlob();
  }

  validateCsv(): void {
    if (!this.currentCsvBlob) {
      return;
    }

    this.isValidating = true;
    this.validationRequested = true;
    this.hasValidated = false;
    this.validationErrors = [];
    this.validationSummary = '';
    this.canSubmit = false;
    this.submitError = false;
    this.validatedCsvBlob = null;

    this.bulkSearchService.validateCsvFile(this.currentCsvBlob).subscribe({
      next: result => {
        this.validationErrors = result?.errors ?? [];
        this.validationSummary = this.buildValidationSummary(result);
        this.canSubmit = result?.valid !== false;
        this.hasValidated = true;
        this.validatedCsvBlob = this.canSubmit ? this.currentCsvBlob : null;
        this.isValidating = false;
      },
      error: () => {
        this.validationErrors = [{ lineNumber: 0, column: '', message: 'Impossibile validare il file CSV.' }];
        this.validationSummary = 'Validazione del CSV non disponibile.';
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

  private buildValidationSummary(
    result: { detectedTemplate?: string; totalRows?: number; validRows?: number; invalidRows?: number; valid?: boolean } | null,
  ): string {
    if (!result) {
      return '';
    }

    const parts: string[] = [];
    if (result.detectedTemplate) {
      parts.push(`template: ${result.detectedTemplate}`);
    }
    if (typeof result.totalRows === 'number') {
      parts.push(`${result.totalRows} righe totali`);
    }
    if (typeof result.validRows === 'number') {
      parts.push(`${result.validRows} righe valide`);
    }
    if (typeof result.invalidRows === 'number') {
      parts.push(`${result.invalidRows} righe non valide`);
    }

    if (result.valid === false && !parts.length) {
      return 'CSV non valido.';
    }

    if (result.valid === true && !parts.length) {
      return 'CSV valido.';
    }

    return parts.join(' · ');
  }
}
