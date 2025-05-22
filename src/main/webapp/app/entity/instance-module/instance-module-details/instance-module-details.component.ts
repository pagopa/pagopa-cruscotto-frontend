import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';
import { InstanceModuleService } from '../service/instance-module.service';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { KpiB2ResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-result-table/kpi-b2-result-table.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [CommonModule, MatCard, MatCardContent, TranslatePipe, FormatDatePipe, KpiB2ResultTableComponent, NgxSpinnerComponent],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  moduleDetails?: IInstanceModule;

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);

  constructor(private instanceModuleService: InstanceModuleService) {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.moduleId) {
      this.loadModuleDetails(this.moduleId);
    }
  }

  /**
   * Caricamento dei dettagli del modulo con gestione dello spinner
   */
  loadModuleDetails(id: number): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isLoadingResults = true; // Indica che il caricamento è in corso

      this.instanceModuleService.find(id).subscribe({
        next: res => {
          if (res.body) {
            this.onSuccess(res.body);
          } else {
            this.onError('Risposta senza corpo!');
          }
        },
        error: error => {
          this.onError(error);
        },
      });
    });
  }

  /**
   * Metodo chiamato al completamento positivo della chiamata API
   */
  protected onSuccess(data: IInstanceModule): void {
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
      this.moduleDetails = data; // Imposta i dettagli del modulo
      console.log('Dati caricati con successo:', this.moduleDetails);
    });
  }

  /**
   * Metodo chiamato in caso di errore
   */
  protected onError(error: any): void {
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
      this.moduleDetails = undefined; // Resetta i dettagli del modulo in caso di errore
      console.error('Errore durante il caricamento:', error);
    });
  }
}
