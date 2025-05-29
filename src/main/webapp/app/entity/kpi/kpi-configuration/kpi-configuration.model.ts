export interface IKpiConfiguration {
  id: number;
  moduleId?: number | null;
  moduleCode?: string | null;
  excludePlannedShutdown?: boolean | null;
  excludeUnplannedShutdown?: boolean | null;
  eligibilityThreshold?: string | null;
  tolerance?: string | null;
  averageTimeLimit?: string | null;
  evaluationType?: string | null;
}

export type NewKpiConfiguration = Omit<IKpiConfiguration, 'id'> & { id: null };
