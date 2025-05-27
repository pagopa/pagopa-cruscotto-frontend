export interface IKpiConfiguration {
  id: number;
  moduleId?: number | null;
  moduleCode?: string | null;
  excludePlannedShutdown?: boolean | null;
  excludeUnplannedShutdown?: boolean | null;
  eligibilityThreshold?: number | null;
  tolerance?: string | null;
  averageTimeLimit?: string | null;
  evaluationType?: string | null;
}
