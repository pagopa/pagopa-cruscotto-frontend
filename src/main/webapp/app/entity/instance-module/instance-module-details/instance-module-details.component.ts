import { Component, computed, EventEmitter, inject, Input, input, OnChanges, OnInit, Output, Type } from '@angular/core';
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
import { KpiB9ResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-result-table/kpi-b9-result-table.component';
import { KpiB9DetailResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-detail-result-table/kpi-b9-detail-result-table.component';
import { KpiB9AnalyticResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-analytic-result-table/kpi-b9-analytic-result-table.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EventManager } from 'app/core/util/event-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Authority } from 'app/config/authority.constants';
import { AccountService } from 'app/core/auth/account.service';
import { IInstance, InstanceStatus } from 'app/entity/instance/models/instance.model';
import { switchMap } from 'rxjs';
import { InstanceService } from 'app/entity/instance/service/instance.service';
import { ModuleStatus } from '../models/module-status.model';
import { KpiA1RecordedTimeoutRequest } from 'app/entity/kpi/kpi-a1/models/KpiA1RecordedTimeout';
import { KpiA1RecordedTimeoutTableComponent } from 'app/entity/kpi/kpi-a1/kpi-a1-recorded-timeout-table/kpi-a1-recorded-timeout-table.component';
import { KpiA1AnalyticData } from 'app/entity/kpi/kpi-a1/models/KpiA1AnalyticData';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    TranslatePipe,
    FormatDatePipe,
    MatSelectModule,
    NgxSpinnerComponent,
    KpiA1ResultTableComponent,
    KpiA1DetailResultTableComponent,
    KpiA1AnalyticResultTableComponent,
    KpiA1RecordedTimeoutTableComponent,
    KpiA2ResultTableComponent,
    KpiA2AnalyticResultTableComponent,
    KpiA2DetailResultTableComponent,
    KpiB2DetailResultTableComponent,
    KpiB2ResultTableComponent,
    KpiB2AnalyticResultTableComponent,
    KpiB9ResultTableComponent,
    KpiB9DetailResultTableComponent,
    KpiB9AnalyticResultTableComponent,
  ],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  @Input() instance?: IInstance;
  moduleDetails?: IInstanceModule;

  selectedKpiResultIdForDetailsResults: number | null = null;
  selectedKpiDetailResultIdForAnalytics: number | null = null;

  selectedKpiB2ResultIdForDetailsResults: number | null = null;
  selectedKpiB2DetailResultIdForAnalytics: number | null = null;
  selectedKpiA2ResultIdForDetailsResults: number | null = null;
  selectedKpiA2DetailResultIdForAnalytics: number | null = null;
  selectedKpiA1ResultIdForDetailsResults: number | null = null;
  selectedKpiA1DetailResultIdForAnalytics: number | null = null;
  selectedKpiB9ResultIdForDetailsResults: number | null = null;
  selectedKpiB9DetailResultIdForAnalytics: number | null = null;

  selectedKpiA1analyticDataId: number | null = null;

  isLoadingResults = false;
  hasPermission;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly toastrService = inject(ToastrService);
  private readonly accountService = inject(AccountService);
  private readonly instanceModuleService = inject(InstanceModuleService);
  private readonly instanceService = inject(InstanceService);
  protected readonly AnalysisType = AnalysisType;
  protected readonly Authority = Authority;

  detailComponentMapping: DetailComponentMappingDynamic = {
    'B.2': {
      resultTable: KpiB2DetailResultTableComponent,
      analyticTable: KpiB2AnalyticResultTableComponent,
    },
  };

  constructor() {
    this.locale = this.translateService.currentLang;

    const currentAccount = this.accountService.trackCurrentAccount();
    this.hasPermission = computed(
      () => currentAccount()?.authorities && this.accountService.hasAnyAuthority(Authority.INSTANCE_MANAGEMENT),
    );
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
  onShowDetailsB9(kpiB9ResultId: number): void {
    this.selectedKpiB9ResultIdForDetailsResults = this.selectedKpiB9ResultIdForDetailsResults === kpiB9ResultId ? null : kpiB9ResultId;
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

  onAnalyticsShowDetailsB9(kpiB9DetailResultId: number): void {
    this.selectedKpiB9DetailResultIdForAnalytics =
      this.selectedKpiB9DetailResultIdForAnalytics === kpiB9DetailResultId ? null : kpiB9DetailResultId;
  }

  // Metodi per la visualizzazione del quarto drilldown
  onRecordedTimeoutQuery(kpiA1analyticDataId: number): void {
    this.selectedKpiA1analyticDataId = this.selectedKpiA1analyticDataId === kpiA1analyticDataId ? null : kpiA1analyticDataId;
  }

  /**
   * Metodo per resettare tutte le variabili legate ad analytics
   */
  resetAnalyticsVariables(): void {
    this.selectedKpiB2DetailResultIdForAnalytics = null;
    this.selectedKpiA2DetailResultIdForAnalytics = null;
    this.selectedKpiA1DetailResultIdForAnalytics = null;
    this.selectedKpiB9DetailResultIdForAnalytics = null;
  }

  /**
   * Metodo per resettare tutte le variabili legate ad analytics
   */
  resetAllVariables(): void {
    this.selectedKpiB2ResultIdForDetailsResults = null;
    this.selectedKpiA2ResultIdForDetailsResults = null;
    this.selectedKpiA1ResultIdForDetailsResults = null;
    this.selectedKpiB9ResultIdForDetailsResults = null;
    this.selectedKpiB2DetailResultIdForAnalytics = null;
    this.selectedKpiA2DetailResultIdForAnalytics = null;
    this.selectedKpiA1DetailResultIdForAnalytics = null;
    this.selectedKpiB9DetailResultIdForAnalytics = null;
  }

  isManualOutcomeAllowed(): boolean {
    if (!this.moduleDetails?.allowManualOutcome || this.moduleDetails.status == ModuleStatus.NON_ATTIVO) return false;
    else
      switch (this.moduleDetails.analysisType) {
        case AnalysisType.MANUALE:
          return true;
        case AnalysisType.AUTOMATICA:
          return this.instance?.status == InstanceStatus.Eseguita;
      }
    return false;
  }

  setModuleManualOutcome(event: MatSelectChange): void {
    const copy = this.moduleDetails!;
    copy.manualOutcome = event.value;
    this.eventManager.broadcast({
      name: 'pagopaCruscottoApp.alert',
      content: { type: 'warning', translationKey: 'pagopaCruscottoApp.instanceModule.detail.settingManualOutcome' },
    });
    this.instanceModuleService
      .patch(copy)
      .pipe(switchMap(_ => this.instanceService.find(this.instance!.id)))
      .subscribe({
        next: _ => {
          this.toastrService.clear();
          this.eventManager.broadcast({
            name: 'pagopaCruscottoApp.alert',
            content: { type: 'success', translationKey: 'pagopaCruscottoApp.instanceModule.detail.manualOutcomeSet' },
          });
          // this.loadModuleDetails(this.moduleDetails!.id!);
          if (this.instance) {
            this.instance.lastAnalysisOutcome = _.body?.lastAnalysisOutcome;
            this.instance.status = _.body?.status;
          }
        },
      });
  }

  setModuleStatus(event: MatSelectChange): void {
    const copy = structuredClone(this.moduleDetails!);
    copy.status = event.value;
    this.eventManager.broadcast({
      name: 'pagopaCruscottoApp.alert',
      content: { type: 'warning', translationKey: 'pagopaCruscottoApp.instanceModule.detail.settingModuleStatus' },
    });
    this.instanceModuleService.patch(copy).subscribe({
      next: _ => {
        this.toastrService.clear();
        this.eventManager.broadcast({
          name: 'pagopaCruscottoApp.alert',
          content: { type: 'success', translationKey: 'pagopaCruscottoApp.instanceModule.detail.moduleStatusSet' },
        });
      },
    });
  }
}

type DetailComponentMappingDynamic = {
  [key: string]: {
    resultTable: Type<any>;
    analyticTable: Type<any>;
  };
};
