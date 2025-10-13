import { IModuleConfiguration } from '../../module/module.model';

export interface IKpiConfiguration extends IModuleConfiguration {
  id: number;
  moduleId?: number | null;
  moduleCode?: string | null;
  moduleName?: string | null;
  excludePlannedShutdown?: boolean | null;
  excludeUnplannedShutdown?: boolean | null;
  eligibilityThreshold?: number | null;
  tolerance?: number | null;
  averageTimeLimit?: number | null;
  evaluationType?: string | null;
  instituteCount?: number | null;
  transactionCount?: number | null;
  instituteTolerance?: number | null;
  transactionTolerance?: number | null;
}

export type NewKpiConfiguration = Omit<IKpiConfiguration, 'id'> & { id: null };
