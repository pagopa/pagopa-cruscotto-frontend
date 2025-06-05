export interface IModule {
  id: number;
  code?: string | null;
  name?: string;
  description?: string;
  analysisType?: string;
  allowManualOutcome?: boolean | null;
  status?: string;
}

export interface IModuleConfiguration {
  configExcludePlannedShutdown?: boolean | null;
  configExcludeUnplannedShutdown?: boolean | null;
  configEligibilityThreshold?: boolean | null;
  configTolerance?: boolean | null;
  configAverageTimeLimit?: boolean | null;
  configEvaluationType?: boolean | null;
}

export class ModuleConfiguration implements IModuleConfiguration {
  configExcludePlannedShutdown = false;
  configExcludeUnplannedShutdown = false;
  configEligibilityThreshold = false;
  configTolerance = false;
  configAverageTimeLimit = false;
  configEvaluationType = false;

  constructor(configuration?: IModuleConfiguration) {
    if (configuration) {
      this.configExcludePlannedShutdown = configuration.configExcludePlannedShutdown ?? false;
      this.configExcludeUnplannedShutdown = configuration.configExcludeUnplannedShutdown ?? false;
      this.configEligibilityThreshold = configuration.configEligibilityThreshold ?? false;
      this.configTolerance = configuration.configTolerance ?? false;
      this.configAverageTimeLimit = configuration.configAverageTimeLimit ?? false;
      this.configEvaluationType = configuration.configEvaluationType ?? false;
    }
  }
}
