import { IUser } from '../../admin-users/user-management/user-management.model';

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
  configExcludePlannedShutdown = true;
  configExcludeUnplannedShutdown = true;
  configEligibilityThreshold = true;
  configTolerance = true;
  configAverageTimeLimit = true;
  configEvaluationType = true;

  constructor(configuration?: IModuleConfiguration) {
    if (configuration) {
      this.configExcludePlannedShutdown = configuration.configExcludePlannedShutdown ?? true;
      this.configExcludeUnplannedShutdown = configuration.configExcludeUnplannedShutdown ?? true;
      this.configEligibilityThreshold = configuration.configEligibilityThreshold ?? true;
      this.configTolerance = configuration.configTolerance ?? true;
      this.configAverageTimeLimit = configuration.configAverageTimeLimit ?? true;
      this.configEvaluationType = configuration.configEvaluationType ?? true;
    }
  }
}
