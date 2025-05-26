import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';
import { InstanceModuleService } from '../service/instance-module.service';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { KpiB2ResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-result-table/kpi-b2-result-table.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { KpiA2ResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-result-table/kpi-a2-result-table.component';
import { KpiA1ResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-result-table/kpi-a1-result-table.component';
import { KpiB2DetailResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-detail-result-table/kpi-b2-detail-result-table.component';
import { KpiB2AnalyticResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-analytic-result-table/kpi-b2-analytic-result-table.component';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    TranslatePipe,
    FormatDatePipe,
    KpiB2ResultTableComponent,
    NgxSpinnerComponent,
    KpiA2ResultTableComponent,
    KpiA1ResultTableComponent,
    KpiB2DetailResultTableComponent,
    KpiB2AnalyticResultTableComponent,
  ],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  moduleDetails?: IInstanceModule;
  // Questo ID tiene traccia del pulsante "Show Details" selezionato
  selectedKpiB2ResultIdForDetailsResults: number | null = null;
  selectedKpiB2DetailResultIdForAnalytics: number | null = null;

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
    this.spinner.show('isLoadingResultsInstanceModuleDetail').then(() => {
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
    this.spinner.hide('isLoadingResultsInstanceModuleDetail').then(() => {
      this.isLoadingResults = false;
      this.moduleDetails = data; // Imposta i dettagli del modulo
      this.selectedKpiB2ResultIdForDetailsResults = null; // mi permette di resettare le varie tabelle di dettaglio seconde
      this.selectedKpiB2DetailResultIdForAnalytics = null;
      console.log('Dati caricati con successo:', this.moduleDetails);
    });
  }

  /**
   * Metodo chiamato in caso di errore
   */
  protected onError(error: any): void {
    this.spinner.hide('isLoadingResultsInstanceModuleDetail').then(() => {
      this.isLoadingResults = false;
      this.moduleDetails = undefined; // Resetta i dettagli del modulo in caso di errore
      this.selectedKpiB2ResultIdForDetailsResults = null; // mi permette di resettare le varie tabelle di dettaglio seconde
      this.selectedKpiB2DetailResultIdForAnalytics = null;
      console.error('Errore durante il caricamento:', error);
    });
  }

  /**
   * Metodo che viene richiamato quando si clicca il pulsante "Show Details" sulla tabella kpiB2results
   */
  onShowDetails(kpiB2ResultId: number): void {
    this.selectedKpiB2ResultIdForDetailsResults = this.selectedKpiB2ResultIdForDetailsResults === kpiB2ResultId ? null : kpiB2ResultId;
    this.selectedKpiB2DetailResultIdForAnalytics = null;
  }

  /**
   * Metodo che viene richiamato quando si clicca il pulsante "Show Analytic Details"
   */
  onAnalyticsShowDetails(kpiB2DetailResultId: number): void {
    this.selectedKpiB2DetailResultIdForAnalytics =
      this.selectedKpiB2DetailResultIdForAnalytics === kpiB2DetailResultId ? null : kpiB2DetailResultId;
  }
}
