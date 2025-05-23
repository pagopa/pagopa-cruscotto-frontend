import dayjs from 'dayjs/esm';
import { Instance } from '../../../instance/models/instance.model';
import { InstanceModule } from '../../../instance-module/models/instance-module.model';

export class KpiA2Result {
  id: number | null;
  instance: Instance | null;
  instanceId: number | null;
  instanceModule: InstanceModule | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  tollerance: number | null;
  evaluationType: EvaluationType | null;
  outcome: OutcomeStatus | null;

  constructor(
    id: number | null = null,
    instance: Instance | null = null,
    instanceId: number | null = null,
    instanceModule: InstanceModule | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    tollerance: number | null = null,
    evaluationType: EvaluationType | null = null,
    outcome: OutcomeStatus | null = null,
  ) {
    this.id = id;
    this.instance = instance;
    this.instanceId = instanceId;
    this.instanceModule = instanceModule;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.tollerance = tollerance;
    this.evaluationType = evaluationType;
    this.outcome = outcome;
  }
}

export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}

export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
