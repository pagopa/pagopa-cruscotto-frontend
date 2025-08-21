import { Component, inject, Input, OnChanges, OnInit, Type } from '@angular/core';
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
import { AnalysisType } from '../models/analysis-type.model';
import { KpiA2DetailResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-detail-result-table/kpi-a2-detail-result-table.component';
import { KpiA2AnalyticResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-analytic-result-table/kpi-a2-analytic-result-table.component';
import { KpiA1DetailResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-detail-result-table/kpi-a1-detail-result-table.component';
import { KpiA1AnalyticResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-analytic-result-table/kpi-a1-analytic-result-table.component';
import { KpiA2WrongTaxCodesService } from '../../kpi/kpi-a2/service/kpi-a2-wrong-tax-codes.service';
import { KpiA2AnalyticData } from 'app/entity/kpi/kpi-a2/models/KpiA2AnalyticData';
import { ActivatedRoute } from '@angular/router';
import { DATE_FORMAT } from 'app/config/input.constants';

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
    KpiA2DetailResultTableComponent,
    KpiA2AnalyticResultTableComponent,
    KpiA1DetailResultTableComponent,
    KpiA1AnalyticResultTableComponent,
  ],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  moduleDetails?: IInstanceModule;

  selectedKpiResultIdForDetailsResults: number | null = null;
  selectedKpiDetailResultIdForAnalytics: number | null = null;

  selectedKpiB2ResultIdForDetailsResults: number | null = null;
  selectedKpiB2DetailResultIdForAnalytics: number | null = null;
  selectedKpiA2ResultIdForDetailsResults: number | null = null;
  selectedKpiA2DetailResultIdForAnalytics: number | null = null;
  selectedKpiA1ResultIdForDetailsResults: number | null = null;
  selectedKpiA1DetailResultIdForAnalytics: number | null = null;

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  protected readonly AnalysisType = AnalysisType;

  detailComponentMapping: DetailComponentMappingDynamic = {
    'B.2': {
      resultTable: KpiB2DetailResultTableComponent,
      analyticTable: KpiB2AnalyticResultTableComponent,
    },
  };

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
      this.resetAllVariables();
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
      this.resetAllVariables();
      console.error('Errore durante il caricamento:', error);
    });
  }

  /**
   * Metodo che viene richiamato quando si clicca il pulsante "Show Details" sulla tabella kpiB2results
   */
  onShowDetailsB2(kpiB2ResultId: number): void {
    this.selectedKpiB2ResultIdForDetailsResults = this.selectedKpiB2ResultIdForDetailsResults === kpiB2ResultId ? null : kpiB2ResultId;
    this.resetAnalyticsVariables(); // Reset delle variabili analytics
  }
  onShowDetailsA2(kpiA2ResultId: number): void {
    this.selectedKpiA2ResultIdForDetailsResults = this.selectedKpiA2ResultIdForDetailsResults === kpiA2ResultId ? null : kpiA2ResultId;
    this.resetAnalyticsVariables(); // Reset delle variabili analytics
  }
  onShowDetailsA1(kpiA1ResultId: number): void {
    this.selectedKpiA1ResultIdForDetailsResults = this.selectedKpiA1ResultIdForDetailsResults === kpiA1ResultId ? null : kpiA1ResultId;
    this.resetAnalyticsVariables(); // Reset delle variabili analytics
  }

  /**
   * Metodo che viene richiamato quando si clicca il pulsante "Show Analytic Details"
   */
  onAnalyticsShowDetailsB2(kpiB2DetailResultId: number): void {
    this.selectedKpiB2DetailResultIdForAnalytics =
      this.selectedKpiB2DetailResultIdForAnalytics === kpiB2DetailResultId ? null : kpiB2DetailResultId;
  }
  onAnalyticsShowDetailsA2(kpiA2DetailResultId: number): void {
    this.selectedKpiA2DetailResultIdForAnalytics =
      this.selectedKpiA2DetailResultIdForAnalytics === kpiA2DetailResultId ? null : kpiA2DetailResultId;
  }
  onAnalyticsShowDetailsA1(kpiA1DetailResultId: number): void {
    this.selectedKpiA1DetailResultIdForAnalytics =
      this.selectedKpiA1DetailResultIdForAnalytics === kpiA1DetailResultId ? null : kpiA1DetailResultId;
  }

  /**
   * Metodo per resettare tutte le variabili legate ad analytics
   */
  resetAnalyticsVariables(): void {
    this.selectedKpiB2DetailResultIdForAnalytics = null;
    this.selectedKpiA2DetailResultIdForAnalytics = null;
    this.selectedKpiA1DetailResultIdForAnalytics = null;
  }

  /**
   * Metodo per resettare tutte le variabili legate ad analytics
   */
  resetAllVariables(): void {
    this.selectedKpiB2ResultIdForDetailsResults = null;
    this.selectedKpiA2ResultIdForDetailsResults = null;
    this.selectedKpiA1ResultIdForDetailsResults = null;
    this.selectedKpiB2DetailResultIdForAnalytics = null;
    this.selectedKpiA2DetailResultIdForAnalytics = null;
    this.selectedKpiA1DetailResultIdForAnalytics = null;
  }
}

type DetailComponentMappingDynamic = {
  [key: string]: {
    resultTable: Type<any>;
    analyticTable: Type<any>;
  };
};
