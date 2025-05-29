export interface InfoResponse {
  'display-ribbon-on-profiles'?: string;
  git?: any;
  build?: BuildInfo;
  activeProfiles?: string[];
}

export class ProfileInfo {
  constructor(
    public activeProfiles?: string[],
    public ribbonEnv?: string,
    public inProduction?: boolean,
    public openAPIEnabled?: boolean,
    public build?: BuildInfo,
  ) {}
}

export class BuildInfo {
  constructor(
    public artifact?: string,
    public name?: string,
    public time?: string,
    public version?: string,
    public group?: string,
  ) {}
}
