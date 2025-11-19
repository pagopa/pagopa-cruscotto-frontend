import { Component, computed, inject, Input, OnChanges, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';
import { InstanceModuleService } from '../service/instance-module.service';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1ResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-result-table/kpi-a1-result-table.component';
import { KpiA1DetailResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-detail-result-table/kpi-a1-detail-result-table.component';
import { KpiA1AnalyticResultTableComponent } from '../../kpi/kpi-a1/kpi-a1-analytic-result-table/kpi-a1-analytic-result-table.component';
import { KpiA1RecordedTimeoutTableComponent } from 'app/entity/kpi/kpi-a1/kpi-a1-recorded-timeout-table/kpi-a1-recorded-timeout-table.component';
import { KpiA2ResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-result-table/kpi-a2-result-table.component';
import { KpiA2DetailResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-detail-result-table/kpi-a2-detail-result-table.component';
import { KpiA2AnalyticResultTableComponent } from '../../kpi/kpi-a2/kpi-a2-analytic-result-table/kpi-a2-analytic-result-table.component';
import { KpiA2AnalyticDrilldownTableComponent } from '../../kpi/kpi-a2/kpi-a2-analytic-drilldown-table/kpi-a2-analytic-drilldown-table.component';
import { KpiB1ResultTableComponent } from 'app/entity/kpi/kpi-b1/kpi-b1-result-table/kpi-b1-result-table.component';
import { KpiB1DetailResultTableComponent } from 'app/entity/kpi/kpi-b1/kpi-b1-detail-result-table/kpi-b1-detail-result-table.component';
import { KpiB1AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b1/kpi-b1-analytic-result-table/kpi-b1-analytic-result-table.component';
import { KpiB1AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b1/kpi-b1-analytic-drilldown-table/kpi-b1-analytic-drilldown-table.component';
import { KpiB2ResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-result-table/kpi-b2-result-table.component';
import { KpiB2DetailResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-detail-result-table/kpi-b2-detail-result-table.component';
import { KpiB2AnalyticResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-analytic-result-table/kpi-b2-analytic-result-table.component';
import { KpiB2RecordedTimeoutTableComponent } from 'app/entity/kpi/kpi-b2/kpi-b2-recorded-timeout-table/kpi-b2-recorded-timeout-table.component';
import { KpiB3ResultTableComponent } from '../../kpi/kpi-b3/kpi-b3-result-table/kpi-b3-result-table.component';
import { KpiB3DetailResultTableComponent } from 'app/entity/kpi/kpi-b3/kpi-b3-detail-result-table/kpi-b3-detail-result-table.component';
import { KpiB3AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b3/kpi-b3-analytic-result-table/kpi-b3-analytic-result-table.component';
import { KpiB3AnalyticData } from 'app/entity/kpi/kpi-b3/models/KpiB3AnalyticData';
import { KpiB3AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b3/kpi-b3-analytic-drilldown-table/kpi-b3-analytic-drilldown-table.component';
import { KpiB4ResultTableComponent } from 'app/entity/kpi/kpi-b4/kpi-b4-result-table/kpi-b4-result-table.component';
import { KpiB4DetailResultTableComponent } from 'app/entity/kpi/kpi-b4/kpi-b4-detail-result-table/kpi-b4-detail-result-table.component';
import { KpiB4AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b4/kpi-b4-analytic-result-table/kpi-b4-analytic-result-table.component';
import { KpiB4AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b4/kpi-b4-analytic-drilldown-table/kpi-b4-analytic-drilldown-table.component';
import { KpiB5ResultTableComponent } from 'app/entity/kpi/kpi-b5/kpi-b5-result-table/kpi-b5-result-table.component';
import { KpiB5DetailResultTableComponent } from 'app/entity/kpi/kpi-b5/kpi-b5-detail-result-table/kpi-b5-detail-result-table.component';
import { KpiB5AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b5/kpi-b5-analytic-result-table/kpi-b5-analytic-result-table.component';
import { KpiB5AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b5/kpi-b5-analytic-drilldown-table/kpi-b5-analytic-drilldown-table.component';
import { KpiB6ResultTableComponent } from 'app/entity/kpi/kpi-b6/kpi-b6-result-table/kpi-b6-result-table.component';
import { KpiB6DetailResultTableComponent } from 'app/entity/kpi/kpi-b6/kpi-b6-detail-result-table/kpi-b6-detail-result-table.component';
import { KpiB6AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b6/kpi-b6-analytic-result-table/kpi-b6-analytic-result-table.component';
import { KpiB8ResultTableComponent } from 'app/entity/kpi/kpi-b8/kpi-b8-result-table/kpi-b8-result-table.component';
import { KpiB8DetailResultTableComponent } from 'app/entity/kpi/kpi-b8/kpi-b8-detail-result-table/kpi-b8-detail-result-table.component';
import { KpiB8AnalyticResultTableComponent } from 'app/entity/kpi/kpi-b8/kpi-b8-analytic-result-table/kpi-b8-analytic-result-table.component';
import { KpiB8AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b8/kpi-b8-analytic-drilldown-table/kpi-b8-analytic-drilldown-table.component';
import { KpiB9ResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-result-table/kpi-b9-result-table.component';
import { KpiB9DetailResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-detail-result-table/kpi-b9-detail-result-table.component';
import { KpiB9AnalyticResultTableComponent } from '../../kpi/kpi-b9/kpi-b9-analytic-result-table/kpi-b9-analytic-result-table.component';
import { KpiB9AnalyticData } from 'app/entity/kpi/kpi-b9/models/KpiB9AnalyticData';
import { KpiB9AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-b9/kpi-b9-analytic-drilldown-table/kpi-b9-analytic-drilldown-table.component';
import { KpiC1ResultTableComponent } from 'app/entity/kpi/kpi-c1/kpi-c1-result-table/kpi-c1-result-table.component';
import { KpiC1DetailResultTableComponent } from 'app/entity/kpi/kpi-c1/kpi-c1-detail-result-table/kpi-c1-detail-result-table.component';
import { KpiC1AnalyticResultTableComponent } from 'app/entity/kpi/kpi-c1/kpi-c1-analytic-result-table/kpi-c1-analytic-result-table.component';
import { KpiC1AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-c1/kpi-c1-analytic-drilldown-table/kpi-c1-analytic-drilldown-table.component';
import { KpiC2ResultTableComponent } from 'app/entity/kpi/kpi-c2/kpi-c2-result-table/kpi-c2-result-table.component';
import { KpiC2DetailResultTableComponent } from 'app/entity/kpi/kpi-c2/kpi-c2-detail-result-table/kpi-c2-detail-result-table.component';
import { KpiC2AnalyticResultTableComponent } from 'app/entity/kpi/kpi-c2/kpi-c2-analytic-result-table/kpi-c2-analytic-result-table.component';
import { KpiC2AnalyticDrilldownTableComponent } from 'app/entity/kpi/kpi-c2/kpi-c2-analytic-drilldown-table/kpi-c2-analytic-drilldown-table.component';
import { AnalysisType } from '../models/analysis-type.model';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EventManager } from 'app/core/util/event-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Authority } from 'app/config/authority.constants';
import { AccountService } from 'app/core/auth/account.service';
import { IInstance, InstanceStatus } from 'app/entity/instance/models/instance.model';
import { switchMap } from 'rxjs';
import { InstanceService } from 'app/entity/instance/service/instance.service';
import { ModuleStatus } from '../models/module-status.model';
import dayjs, { Dayjs } from 'dayjs/esm';

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
    KpiA2AnalyticDrilldownTableComponent,
    KpiB1ResultTableComponent,
    KpiB1DetailResultTableComponent,
    KpiB1AnalyticResultTableComponent,
    KpiB1AnalyticDrilldownTableComponent,
    KpiB2ResultTableComponent,
    KpiB2DetailResultTableComponent,
    KpiB2AnalyticResultTableComponent,
    KpiB2RecordedTimeoutTableComponent,
    KpiB3ResultTableComponent,
    KpiB3DetailResultTableComponent,
    KpiB3AnalyticResultTableComponent,
    KpiB3AnalyticDrilldownTableComponent,
    KpiB4ResultTableComponent,
    KpiB4DetailResultTableComponent,
    KpiB4AnalyticResultTableComponent,
    KpiB4AnalyticDrilldownTableComponent,
    KpiB5ResultTableComponent,
    KpiB5DetailResultTableComponent,
    KpiB5AnalyticResultTableComponent,
    KpiB5AnalyticDrilldownTableComponent,
    KpiB6ResultTableComponent,
    KpiB6DetailResultTableComponent,
    KpiB6AnalyticResultTableComponent,
    KpiB8ResultTableComponent,
    KpiB8DetailResultTableComponent,
    KpiB8AnalyticResultTableComponent,
    KpiB8AnalyticDrilldownTableComponent,
    KpiB9AnalyticResultTableComponent,
    KpiB9ResultTableComponent,
    KpiB9DetailResultTableComponent,
    KpiB9AnalyticDrilldownTableComponent,
    KpiC1ResultTableComponent,
    KpiC1DetailResultTableComponent,
    KpiC1AnalyticResultTableComponent,
    KpiC1AnalyticDrilldownTableComponent,
    KpiC2ResultTableComponent,
    KpiC2DetailResultTableComponent,
    KpiC2AnalyticResultTableComponent,
    KpiC2AnalyticDrilldownTableComponent,
  ],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  @Input() instance?: IInstance;
  moduleDetails?: IInstanceModule;

  selectedKpiA1ResultIdForDetailsResults: number | null = null;
  selectedKpiA2ResultIdForDetailsResults: number | null = null;
  selectedKpiB1ResultIdForDetailsResults: number | null = null;
  selectedKpiB2ResultIdForDetailsResults: number | null = null;
  selectedKpiB3ResultIdForDetailsResults: number | null = null;
  selectedKpiB4ResultIdForDetailsResults: number | null = null;
  selectedKpiB5ResultIdForDetailsResults: number | null = null;
  selectedKpiB6ResultIdForDetailsResults: number | null = null;
  selectedKpiB8ResultIdForDetailsResults: number | null = null;
  selectedKpiB9ResultIdForDetailsResults: number | null = null;
  selectedKpiC1ResultIdForDetailsResults: number | null = null;
  selectedKpiC2ResultIdForDetailsResults: number | null = null;

  selectedKpiA1DetailResultIdForAnalytics: number | null = null;
  selectedKpiA2DetailResultIdForAnalytics: number | null = null;
  selectedKpiB1DetailResultIdForAnalytics: number | null = null;
  selectedKpiB2DetailResultIdForAnalytics: number | null = null;
  selectedKpiB3DetailResultIdForAnalytics: number | null = null;
  selectedKpiB4DetailResultIdForAnalytics: number | null = null;
  selectedKpiB5DetailResultIdForAnalytics: number | null = null;
  selectedKpiB6DetailResultIdForAnalytics: number | null = null;
  selectedKpiB8DetailResultIdForAnalytics: number | null = null;
  selectedKpiB9DetailResultIdForAnalytics: number | null = null;
  selectedKpiC1DetailResultIdForAnalytics: number | null = null;
  selectedKpiC2DetailResultIdForAnalytics: number | null = null;

  selectedKpiA1AnalyticIdForDrilldown: number | null = null;
  selectedKpiA2AnalyticIdForDrilldown: number | null = null;
  selectedKpiA2AnalyticAnalysisDateForDrilldown: Date | string | dayjs.Dayjs | null = null;
  selectedKpiB1AnalyticIdForDrilldown: number | null = null;
  selectedKpiB2AnalyticIdForDrilldown: number | null = null;
  selectedKpiB3AnalyticIdForDrilldown: number | null = null;
  selectedKpiB4AnalyticIdForDrilldown: number | null = null;
  selectedKpiB5AnalyticIdForDrilldown: number | null = null;
  selectedKpiB8AnalyticIdForDrilldown: number | null = null;
  selectedKpiB9AnalyticIdForDrilldown: number | null = null;
  selectedKpiC2AnalyticIdForDrilldown: number | null = null;
  b9DrillInstanceId: number | null = null;
  b9DrillStationId: number | null = null;
  b9DrillEvaluationDate: Dayjs | null = null;
  selectedKpiC1AnalyticIdForDrilldown: number | null = null;

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
   * Metodo che viene richiamato quando si clicca il pulsante "Show Details" sulla tabella Results
   */
  onShowDetailsA1(kpiA1ResultId: number): void {
    this.selectedKpiA1ResultIdForDetailsResults = this.selectedKpiA1ResultIdForDetailsResults === kpiA1ResultId ? null : kpiA1ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsA2(kpiA2ResultId: number): void {
    this.selectedKpiA2ResultIdForDetailsResults = this.selectedKpiA2ResultIdForDetailsResults === kpiA2ResultId ? null : kpiA2ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB1(kpiB1ResultId: number): void {
    this.selectedKpiB1ResultIdForDetailsResults = this.selectedKpiB1ResultIdForDetailsResults === kpiB1ResultId ? null : kpiB1ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB2(kpiB2ResultId: number): void {
    this.selectedKpiB2ResultIdForDetailsResults = this.selectedKpiB2ResultIdForDetailsResults === kpiB2ResultId ? null : kpiB2ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB3(kpiB3ResultId: number): void {
    this.selectedKpiB3ResultIdForDetailsResults = this.selectedKpiB3ResultIdForDetailsResults === kpiB3ResultId ? null : kpiB3ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB4(kpiB4ResultId: number): void {
    this.selectedKpiB4ResultIdForDetailsResults = this.selectedKpiB4ResultIdForDetailsResults === kpiB4ResultId ? null : kpiB4ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB5(kpiB5ResultId: number): void {
    this.selectedKpiB5ResultIdForDetailsResults = this.selectedKpiB5ResultIdForDetailsResults === kpiB5ResultId ? null : kpiB5ResultId;
  }
  onShowDetailsB6(kpiB6ResultId: number): void {
    this.selectedKpiB6ResultIdForDetailsResults = this.selectedKpiB6ResultIdForDetailsResults === kpiB6ResultId ? null : kpiB6ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsB8(kpiB8ResultId: number): void {
    this.selectedKpiB8ResultIdForDetailsResults = this.selectedKpiB8ResultIdForDetailsResults === kpiB8ResultId ? null : kpiB8ResultId;
  }
  onShowDetailsB9(kpiB9ResultId: number): void {
    this.selectedKpiB9ResultIdForDetailsResults = this.selectedKpiB9ResultIdForDetailsResults === kpiB9ResultId ? null : kpiB9ResultId;
    this.resetAnalyticsVariables();
  }
  onShowDetailsC1(kpiC1ResultId: number): void {
    this.selectedKpiC1ResultIdForDetailsResults = this.selectedKpiC1ResultIdForDetailsResults === kpiC1ResultId ? null : kpiC1ResultId;
    this.resetAnalyticsVariables(); // Reset delle variabili analytics
  }
  onShowDetailsC2(kpiC2ResultId: number): void {
    this.selectedKpiC2ResultIdForDetailsResults = this.selectedKpiC2ResultIdForDetailsResults === kpiC2ResultId ? null : kpiC2ResultId;
    this.resetAnalyticsVariables();
  }

  /**
   * Metodo che viene richiamato quando si clicca il pulsante "Show Details" sulla tabella dati di riscontro
   */
  onAnalyticsShowDetailsA1(kpiA1DetailResultId: number): void {
    this.selectedKpiA1DetailResultIdForAnalytics =
      this.selectedKpiA1DetailResultIdForAnalytics === kpiA1DetailResultId ? null : kpiA1DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsA2(kpiA2DetailResultId: number): void {
    this.selectedKpiA2DetailResultIdForAnalytics =
      this.selectedKpiA2DetailResultIdForAnalytics === kpiA2DetailResultId ? null : kpiA2DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB1(kpiB1DetailResultId: number): void {
    this.selectedKpiB1DetailResultIdForAnalytics =
      this.selectedKpiB1DetailResultIdForAnalytics === kpiB1DetailResultId ? null : kpiB1DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB2(kpiB2DetailResultId: number): void {
    this.selectedKpiB2DetailResultIdForAnalytics =
      this.selectedKpiB2DetailResultIdForAnalytics === kpiB2DetailResultId ? null : kpiB2DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB3(kpiB3DetailResultId: number): void {
    this.selectedKpiB3DetailResultIdForAnalytics =
      this.selectedKpiB3DetailResultIdForAnalytics === kpiB3DetailResultId ? null : kpiB3DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB4(kpiB4DetailResultId: number): void {
    this.selectedKpiB4DetailResultIdForAnalytics =
      this.selectedKpiB4DetailResultIdForAnalytics === kpiB4DetailResultId ? null : kpiB4DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB5(kpiB5DetailResultId: number): void {
    this.selectedKpiB5DetailResultIdForAnalytics =
      this.selectedKpiB5DetailResultIdForAnalytics === kpiB5DetailResultId ? null : kpiB5DetailResultId;
  }
  onAnalyticsShowDetailsB6(kpiB6DetailResultId: number): void {
    this.selectedKpiB6DetailResultIdForAnalytics =
      this.selectedKpiB6DetailResultIdForAnalytics === kpiB6DetailResultId ? null : kpiB6DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsB8(kpiB8DetailResultId: number): void {
    this.selectedKpiB8DetailResultIdForAnalytics =
      this.selectedKpiB8DetailResultIdForAnalytics === kpiB8DetailResultId ? null : kpiB8DetailResultId;
  }
  onAnalyticsShowDetailsB9(kpiB9DetailResultId: number): void {
    this.selectedKpiB9DetailResultIdForAnalytics =
      this.selectedKpiB9DetailResultIdForAnalytics === kpiB9DetailResultId ? null : kpiB9DetailResultId;
    this.resetDrilldownVariables();
  }
  onAnalyticsShowDetailsC1(kpiC1DetailResultId: number): void {
    this.selectedKpiC1DetailResultIdForAnalytics =
      this.selectedKpiC1DetailResultIdForAnalytics === kpiC1DetailResultId ? null : kpiC1DetailResultId;
    this.resetDrilldownVariables();
  }

  onAnalyticsShowDetailsC2(kpiC2DetailResultId: number): void {
    this.selectedKpiC2DetailResultIdForAnalytics =
      this.selectedKpiC2DetailResultIdForAnalytics === kpiC2DetailResultId ? null : kpiC2DetailResultId;
    this.resetDrilldownVariables();
  }

  // Metodi per la visualizzazione del quarto drilldown
  onAnalyticDrilldownShowDetailsA1(kpiA1analyticDataId: number): void {
    this.selectedKpiA1AnalyticIdForDrilldown =
      this.selectedKpiA1AnalyticIdForDrilldown === kpiA1analyticDataId ? null : kpiA1analyticDataId;
  }

  onAnalyticDrilldownShowDetailsA2(kpiA2analyticDataId: number): void {
    this.selectedKpiA2AnalyticIdForDrilldown =
      this.selectedKpiA2AnalyticIdForDrilldown === kpiA2analyticDataId ? null : kpiA2analyticDataId;
  }

  onAnalyticDrilldownShowDetailsB1(kpiB1AnalyticDataId: number): void {
    this.selectedKpiB1AnalyticIdForDrilldown =
      this.selectedKpiB1AnalyticIdForDrilldown === kpiB1AnalyticDataId ? null : kpiB1AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB2(kpiB2AnalyticDataId: number): void {
    this.selectedKpiB2AnalyticIdForDrilldown =
      this.selectedKpiB2AnalyticIdForDrilldown === kpiB2AnalyticDataId ? null : kpiB2AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB3(kpiB3AnalyticDataId: number): void {
    this.selectedKpiB3AnalyticIdForDrilldown =
      this.selectedKpiB3AnalyticIdForDrilldown === kpiB3AnalyticDataId ? null : kpiB3AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB4(kpiB4AnalyticDataId: number): void {
    this.selectedKpiB4AnalyticIdForDrilldown =
      this.selectedKpiB4AnalyticIdForDrilldown === kpiB4AnalyticDataId ? null : kpiB4AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB5(kpiB5AnalyticDataId: number): void {
    this.selectedKpiB5AnalyticIdForDrilldown =
      this.selectedKpiB5AnalyticIdForDrilldown === kpiB5AnalyticDataId ? null : kpiB5AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB8(kpiB8AnalyticDataId: number): void {
    this.selectedKpiB8AnalyticIdForDrilldown =
      this.selectedKpiB8AnalyticIdForDrilldown === kpiB8AnalyticDataId ? null : kpiB8AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsB9(row: KpiB9AnalyticData): void {
    if (!row?.instanceId || !row?.stationId || !row?.evaluationDate) return;

    const same =
      this.b9DrillInstanceId === row.instanceId &&
      this.b9DrillStationId === row.stationId &&
      (this.b9DrillEvaluationDate?.isSame(row.evaluationDate, 'day') ?? false);

    if (same) {
      this.b9DrillInstanceId = this.b9DrillStationId = null;
      this.b9DrillEvaluationDate = null;
    } else {
      this.b9DrillInstanceId = row.instanceId!;
      this.b9DrillStationId = row.stationId!;
      this.b9DrillEvaluationDate = row.evaluationDate!;
    }
  }

  onAnalyticDrilldownShowDetailsC1(kpiC1AnalyticDataId: number): void {
    this.selectedKpiC1AnalyticIdForDrilldown =
      this.selectedKpiC1AnalyticIdForDrilldown === kpiC1AnalyticDataId ? null : kpiC1AnalyticDataId;
  }

  onAnalyticDrilldownShowDetailsC2(kpiC2AnalyticDataId: number): void {
    this.selectedKpiC2AnalyticIdForDrilldown =
      this.selectedKpiC2AnalyticIdForDrilldown === kpiC2AnalyticDataId ? null : kpiC2AnalyticDataId;
  }

  /**
   * Metodi per resettare le variabili all'apertura di un diverso dettaglio
   */
  resetDrilldownVariables(): void {
    this.selectedKpiA1AnalyticIdForDrilldown = null;
    this.selectedKpiA2AnalyticIdForDrilldown = null;
    this.selectedKpiB1AnalyticIdForDrilldown = null;
    this.selectedKpiB2AnalyticIdForDrilldown = null;
    this.selectedKpiB3AnalyticIdForDrilldown = null;
    this.selectedKpiB4AnalyticIdForDrilldown = null;
    this.selectedKpiB5AnalyticIdForDrilldown = null;
    this.selectedKpiB8AnalyticIdForDrilldown = null;
    this.selectedKpiB9AnalyticIdForDrilldown = null;
    this.b9DrillInstanceId = this.b9DrillStationId = null;
    this.b9DrillEvaluationDate = null;
    this.selectedKpiC1AnalyticIdForDrilldown = null;
    this.selectedKpiC2AnalyticIdForDrilldown = null;
  }

  resetAnalyticsVariables(): void {
    this.selectedKpiA1DetailResultIdForAnalytics = null;
    this.selectedKpiA2DetailResultIdForAnalytics = null;
    this.selectedKpiB1DetailResultIdForAnalytics = null;
    this.selectedKpiB2DetailResultIdForAnalytics = null;
    this.selectedKpiB3DetailResultIdForAnalytics = null;
    this.selectedKpiB4DetailResultIdForAnalytics = null;
    this.selectedKpiB5DetailResultIdForAnalytics = null;
    this.selectedKpiB6DetailResultIdForAnalytics = null;
    this.selectedKpiB8DetailResultIdForAnalytics = null;
    this.selectedKpiB9DetailResultIdForAnalytics = null;
    this.selectedKpiC1DetailResultIdForAnalytics = null;
    this.selectedKpiC2DetailResultIdForAnalytics = null;
    this.resetDrilldownVariables();
  }

  resetAllVariables(): void {
    this.selectedKpiA1ResultIdForDetailsResults = null;
    this.selectedKpiA2ResultIdForDetailsResults = null;
    this.selectedKpiB1ResultIdForDetailsResults = null;
    this.selectedKpiB2ResultIdForDetailsResults = null;
    this.selectedKpiB2ResultIdForDetailsResults = null;
    this.selectedKpiB3ResultIdForDetailsResults = null;
    this.selectedKpiB4ResultIdForDetailsResults = null;
    this.selectedKpiB5ResultIdForDetailsResults = null;
    this.selectedKpiB6ResultIdForDetailsResults = null;
    this.selectedKpiB8ResultIdForDetailsResults = null;
    this.selectedKpiB9ResultIdForDetailsResults = null;
    this.selectedKpiC1ResultIdForDetailsResults = null;
    this.selectedKpiC2ResultIdForDetailsResults = null;
    this.resetAnalyticsVariables();
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
