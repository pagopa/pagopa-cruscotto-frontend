import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
    <div class="csv-page-shell">
      <div class="d-flex align-items-center justify-content-between mb-3 page-header">
        <div>
          <h2 class="mb-1">Nuova istanza da CSV</h2>
        </div>
        <button type="button" mat-flat-button (click)="previousState()">
          <mat-icon fontSet="material-symbols-outlined">undo</mat-icon>
          <span>Indietro</span>
        </button>
      </div>

      <mat-card class="guide-card">
        <mat-card-content>
          <div
            class="guide-summary"
            (click)="toggleGuide()"
            (keydown.enter)="toggleGuide()"
            (keydown.space)="toggleGuide()"
            tabindex="0"
            role="button"
            [attr.aria-expanded]="isGuideOpen"
          >
            <div class="guide-summary-title">
              <span class="guide-arrow">{{ isGuideOpen ? '▾' : '▸' }}</span>
              <span>Formati CSV supportati</span>
              <span class="guide-count">({{ tutorialTypes.length }})</span>
            </div>
            <button type="button" mat-stroked-button class="guide-toggle-btn" (click)="$event.stopPropagation(); toggleGuide()">
              {{ isGuideOpen ? 'Nascondi guida' : 'Mostra guida' }}
            </button>
          </div>

          @if (isGuideOpen) {
            <div class="guide-content">
              <mat-accordion multi="false">
                @for (type of tutorialTypes; track type.title) {
                  <mat-expansion-panel class="example-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <div class="format-title-block">
                          <span class="format-title">{{ type.title }}</span>
                          <span class="format-description">{{ type.sample }}</span>
                        </div>
                      </mat-panel-title>
                    </mat-expansion-panel-header>

                    <div class="sample-shell">
                      <div class="sample-toolbar">
                        <span class="sample-label">CSV</span>
                        <button type="button" mat-button color="primary" (click)="copyCsvExample(getSampleText(type.sample))">
                          {{ copiedSample === getSampleText(type.sample) ? 'Copiato' : 'Copia esempio' }}
                        </button>
                      </div>
                      <pre>{{ getSampleText(type.sample) }}</pre>
                    </div>
                  </mat-expansion-panel>
                }
              </mat-accordion>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="upload-box">
        <mat-card-content>
          <div
            class="upload-dropzone"
            [class.drag-active]="isDragOver"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <div class="upload-header">
              <div class="upload-icon">
                <mat-icon fontSet="material-symbols-outlined">upload_file</mat-icon>
              </div>
              <div class="upload-text">
                <h3>Carica CSV</h3>
                <p>Trascina qui il tuo file CSV</p>
                <span>oppure</span>
              </div>
            </div>

            <input #fileInput type="file" accept=".csv,text/csv" hidden (change)="onFileSelected(fileInput)" />

            <button type="button" mat-flat-button color="primary" class="select-file-button" (click)="fileInput.click()">
              <mat-icon fontSet="material-symbols-outlined">attach_file</mat-icon>
              <span>Seleziona file</span>
            </button>
          </div>

          <div class="upload-body">
            @if (selectedFileName) {
              <div class="selection-box">
                <div class="selection-details">
                  <div class="selection-icon">
                    <mat-icon fontSet="material-symbols-outlined">description</mat-icon>
                  </div>
                  <div class="selection-meta">
                    <strong>{{ selectedFileName }}</strong>
                    <span>Dimensione: {{ formatFileSize(selectedFileSize) }}</span>
                    <em>✓ File selezionato correttamente</em>
                  </div>
                </div>
                <div class="selection-actions">
                  <button type="button" mat-stroked-button (click)="fileInput.click()">Cambia file</button>
                  <button type="button" mat-button color="warn" (click)="clearSelectedFile()">Rimuovi</button>
                </div>
              </div>

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

        <div class="actions-bar">
          <button
            type="button"
            class="validate-button"
            mat-stroked-button
            (click)="validateCsv()"
            [disabled]="!selectedFileName || isValidating"
            [color]="selectedFileName && !isValidating ? 'primary' : undefined"
          >
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

      .csv-page-shell {
        max-width: 1040px;
        margin: 0 auto;
        padding-bottom: 2rem;
      }

      .page-header {
        margin-bottom: 1rem;
      }

      .guide-card,
      .upload-box {
        margin-bottom: 1rem;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
      }

      .guide-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.5rem 0.25rem;
        cursor: pointer;
      }

      .guide-summary-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.82);
      }

      .guide-arrow {
        color: #464feb;
      }

      .guide-count {
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }

      .guide-toggle-btn {
        flex-shrink: 0;
      }

      .guide-content {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(15, 23, 42, 0.08);
      }

      .format-title-block {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .format-title {
        font-size: 0.95rem;
        font-weight: 700;
      }

      .format-description {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.66);
      }

      .sample-shell {
        margin-top: 0.25rem;
        border: 1px solid rgba(15, 23, 42, 0.1);
        border-radius: 8px;
        background: #f8f9fb;
        overflow: hidden;
      }

      .sample-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.6rem 0.8rem;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(15, 23, 42, 0.02);
      }

      .sample-label {
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(0, 0, 0, 0.62);
        font-weight: 700;
      }

      pre {
        margin: 0;
        padding: 1rem;
        overflow: auto;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 0.86rem;
        line-height: 1.55;
        color: rgba(15, 23, 42, 0.9);
        background: #f8f9fb;
        white-space: pre-wrap;
      }

      .upload-dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1.5rem 1rem 1rem;
        border: 2px dashed rgba(70, 79, 235, 0.26);
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(70, 79, 235, 0.02), rgba(70, 79, 235, 0.04));
        transition:
          border-color 0.2s ease,
          background 0.2s ease,
          transform 0.2s ease;
      }

      .upload-dropzone.drag-active {
        border-color: #464feb;
        background: rgba(70, 79, 235, 0.06);
        transform: translateY(-1px);
      }

      .upload-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
      }

      .upload-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: rgba(70, 79, 235, 0.1);
        color: #464feb;
      }

      .upload-text h3 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.85);
      }

      .upload-text p {
        margin: 0.25rem 0 0.15rem;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.75);
      }

      .upload-text span {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.56);
      }

      .select-file-button {
        min-width: 190px;
      }

      .upload-body {
        padding: 1rem 0 0;
      }

      .selection-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 12px;
        background: rgba(13, 148, 136, 0.03);
      }

      .selection-details {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .selection-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 10px;
        background: rgba(34, 197, 94, 0.12);
        color: #15803d;
      }

      .selection-meta {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .selection-meta strong {
        font-size: 1rem;
      }

      .selection-meta span,
      .selection-meta em {
        font-size: 0.82rem;
      }

      .selection-meta em {
        font-style: normal;
        color: #15803d;
        font-weight: 600;
      }

      .selection-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .preview-box {
        margin-top: 1rem;
        padding: 0.9rem;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 12px;
        background: #fff;
      }

      .preview-label {
        margin-bottom: 0.5rem;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.82);
      }

      textarea {
        resize: vertical;
        min-height: 170px;
        background: #f8f9fb;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 8px;
      }

      .actions-bar {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 0 1rem 1rem;
      }

      .validate-button {
        border-color: rgba(0, 0, 0, 0.2) !important;
      }

      @media (max-width: 767px) {
        .guide-summary,
        .selection-box,
        .actions-bar {
          flex-direction: column;
          align-items: stretch;
        }

        .selection-actions {
          justify-content: flex-start;
        }
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

  isGuideOpen = false;
  isDragOver = false;
  copiedSample: string | null = null;
  selectedFileName = '';
  selectedFileSize = 0;
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

  @ViewChild('fileInput') private readonly fileInput!: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly translateService = inject(TranslateService);
  private currentCsvBlob: Blob | null = null;
  private validatedCsvBlob: Blob | null = null;

  getSampleText(sampleKey: string): string {
    return this.translateService.instant(sampleKey);
  }

  previousState(): void {
    void this.router.navigate(['/bulk/ricerca-massiva']);
  }

  toggleGuide(): void {
    this.isGuideOpen = !this.isGuideOpen;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const droppedFiles = event.dataTransfer?.files;
    const file = droppedFiles?.[0];
    if (!file || !this.fileInput) {
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    this.fileInput.nativeElement.files = dataTransfer.files;
    this.onFileSelected(this.fileInput.nativeElement);
  }

  copyCsvExample(sample: string): void {
    if (!sample) {
      return;
    }

    const value = sample.trim();
    const restoreCopiedState = () => {
      window.setTimeout(() => {
        this.copiedSample = null;
      }, 1500);
    };

    this.copiedSample = value;

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value).then(restoreCopiedState, restoreCopiedState);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = value;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
    restoreCopiedState();
  }

  formatFileSize(bytes: number): string {
    if (!bytes) {
      return '0 KB';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;
    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
  }

  clearSelectedFile(): void {
    this.selectedFileName = '';
    this.selectedFileSize = 0;
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
  }

  onFileSelected(fileInput: HTMLInputElement): void {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    this.selectedFileName = file ? file.name : '';
    this.selectedFileSize = file ? file.size : 0;
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
