import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BulkSearchService } from '../../services/bulk-search.service';
import { MatSelectModule } from '@angular/material/select';
import { CsvValidationError, SelectedReportsValues } from '../../models/bulk-search.model';
import { RICERCA_MASSIVA_CSV_TUTORIAL_TYPES } from '../ricerca-massiva.mock';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'jhi-ricerca-massiva-csv-upload',
  standalone: true,
  templateUrl: './ricerca-massiva-csv-upload.component.html',
  styleUrl: './ricerca-massiva-csv-upload.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
  ],
})
export class RicercaMassivaCsvUploadComponent {
  readonly tutorialTypes = RICERCA_MASSIVA_CSV_TUTORIAL_TYPES;
  readonly selectedReportsValues: SelectedReportsValues[] = ['POSITION', 'TOKEN', 'TRANSFER'];
  readonly form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.maxLength(100)] }),
    selectedReports: new FormControl<string[]>(this.selectedReportsValues),
  });
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

  @ViewChild('fileInput') private readonly fileInputRef!: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly translateService = inject(TranslateService);
  private currentCsvBlob: Blob | null = null;
  private validatedCsvBlob: Blob | null = null;

  constructor() {
    this.form.get('name')?.valueChanges.subscribe(() => this.clearDuplicateNameError());
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
    if (!file || !this.fileInputRef) {
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    this.fileInputRef.nativeElement.files = dataTransfer.files;
    this.onFileSelected();
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

  onFileSelected(): void {
    const file = this.fileInputRef.nativeElement.files?.[0];
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
      error: (response: unknown) => {
        const validationResult = this.extractValidationResult(response);
        this.validationErrors = validationResult?.errors ?? [];
        this.validationSummary = this.buildValidationSummary(validationResult);
        this.canSubmit = validationResult?.valid !== false;
        this.hasValidated = true;
        this.validatedCsvBlob = this.canSubmit ? this.currentCsvBlob : null;
        this.isValidating = false;

        if (!this.validationErrors.length && !this.validationSummary) {
          this.validationErrors = [{ lineNumber: 0, column: null, codeMessage: '', message: 'Impossibile validare il file CSV.' }];
          this.validationSummary = 'Validazione del CSV non disponibile.';
        }
      },
    });
  }

  getValidationMessage(error: CsvValidationError): string {
    const translationKey = `pagopaCruscottoApp.ricercaMassiva.create.csvValidation.${error.codeMessage}`;
    const translatedMessage = this.translateService.instant(translationKey, error);
    return translatedMessage === translationKey ? error.message : translatedMessage;
  }

  submit(): void {
    if (!this.canSubmit || this.form.invalid || !this.validatedCsvBlob || this.isSubmitting) {
      return;
    }

    const fileToSubmit = new File([this.validatedCsvBlob], this.selectedFileName, { type: 'text/csv;charset=utf-8' });
    if (fileToSubmit.size === 0) {
      return;
    }

    const name = this.form.get('name')?.value?.trim() || this.selectedFileName;
    const selectedReports = this.form.get('selectedReports')?.value || [];
    this.isSubmitting = true;
    this.submitError = false;
    this.bulkSearchService.createFromCsv(name, selectedReports, fileToSubmit).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/bulk/ricerca-massiva']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        if (error.status === 409 && error.url?.includes('/api/bulk/search-instances/csv')) {
          this.form.get('name')?.setErrors({ duplicateInstanceName: true });
          return;
        }

        this.submitError = true;
      },
    });
  }

  private clearDuplicateNameError(): void {
    const nameControl = this.form.get('name');
    if (nameControl?.errors?.duplicateInstanceName) {
      const errors = { ...nameControl.errors };
      delete errors.duplicateInstanceName;
      nameControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      this.submitError = false;
    }
  }

  private extractValidationResult(error: unknown): {
    valid?: boolean;
    detectedTemplate?: string;
    totalRows?: number;
    validRows?: number;
    invalidRows?: number;
    errors?: CsvValidationError[];
  } | null {
    if (!error || typeof error !== 'object') {
      return null;
    }

    const payload = (error as { error?: unknown; body?: unknown }).error ?? (error as { error?: unknown; body?: unknown }).body ?? error;
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const result = payload as {
      valid?: boolean;
      detectedTemplate?: string;
      totalRows?: number;
      validRows?: number;
      invalidRows?: number;
      errors?: CsvValidationError[];
    };
    if (
      Array.isArray(result.errors) ||
      typeof result.valid === 'boolean' ||
      typeof result.detectedTemplate === 'string' ||
      typeof result.totalRows === 'number' ||
      typeof result.validRows === 'number' ||
      typeof result.invalidRows === 'number'
    ) {
      return result;
    }

    return null;
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
