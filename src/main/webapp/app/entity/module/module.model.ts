export interface IModule {
  id: number;
  code?: string | null;
  name?: string;
  description?: string;
  analysisType?: string;
  allowManualOutcome?: boolean | null;
  status?: string | null;
  configAverageTimeLimit?: boolean | null;
  configEligibilityThreshold?: boolean | null;
  configEvaluationType?: boolean | null;
  configExcludePlannedShutdown?: boolean | null;
  configExcludeUnplannedShutdown?: boolean | null;
  configTolerance?: boolean | null;
  configInstitutionCount?: boolean | null;
  configTransactionCount?: boolean | null;
  configInstitutionTolerance?: boolean | null;
  configTransactionTolerance?: boolean | null;
}

export type NewModule = Omit<IModule, 'id'> & { id: null };

export interface IModuleConfiguration {
  configExcludePlannedShutdown?: boolean | null;
  configExcludeUnplannedShutdown?: boolean | null;
  configEligibilityThreshold?: boolean | null;
  configTolerance?: boolean | null;
  configAverageTimeLimit?: boolean | null;
  configEvaluationType?: boolean | null;
  configInstitutionCount?: boolean | null;
  configTransactionCount?: boolean | null;
  configInstitutionTolerance?: boolean | null;
  configTransactionTolerance?: boolean | null;
}

export class ModuleConfiguration implements IModuleConfiguration {
  configExcludePlannedShutdown = false;
  configExcludeUnplannedShutdown = false;
  configEligibilityThreshold = false;
  configTolerance = false;
  configAverageTimeLimit = false;
  configEvaluationType = false;
  configInstitutionCount = false;
  configTransactionCount = false;
  configInstitutionTolerance = false;
  configTransactionTolerance = false;

  constructor(configuration?: IModuleConfiguration) {
    if (configuration) {
      this.configExcludePlannedShutdown = configuration.configExcludePlannedShutdown ?? false;
      this.configExcludeUnplannedShutdown = configuration.configExcludeUnplannedShutdown ?? false;
      this.configEligibilityThreshold = configuration.configEligibilityThreshold ?? false;
      this.configTolerance = configuration.configTolerance ?? false;
      this.configAverageTimeLimit = configuration.configAverageTimeLimit ?? false;
      this.configEvaluationType = configuration.configEvaluationType ?? false;
      this.configInstitutionCount = configuration.configInstitutionCount ?? false;
      this.configTransactionCount = configuration.configTransactionCount ?? false;
      this.configInstitutionTolerance = configuration.configInstitutionTolerance ?? false;
      this.configTransactionTolerance = configuration.configTransactionTolerance ?? false;
    }
  }
}
