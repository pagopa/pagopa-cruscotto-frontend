export interface IKpiConfiguration {
  id: number;
  moduleId?: number | null;
  moduleCode?: string | null;
  moduleName?: string | null;
  excludePlannedShutdown?: boolean | null;
  excludeUnplannedShutdown?: boolean | null;
  eligibilityThreshold?: string | null;
  tolerance?: string | null;
  averageTimeLimit?: string | null;
  evaluationType?: string | null;
  configExcludePlannedShutdown?: boolean | null;
  configExcludeUnplannedShutdown?: boolean | null;
  configEligibilityThreshold?: boolean | null;
  configTolerance?: boolean | null;
  configAverageTimeLimit?: boolean | null;
  configEvaluationType?: boolean | null;
}

export type NewKpiConfiguration = Omit<IKpiConfiguration, 'id'> & { id: null };
