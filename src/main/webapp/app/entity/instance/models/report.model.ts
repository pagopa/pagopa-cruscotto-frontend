export interface GenerateReportRequest {
  instanceIds: number[];
  reportType?: ReportType;
  variant?: string;
  language?: string;
  startDate?: string;
  endDate?: string;
  parameters?: Record<string, any>;
}

export type ReportType = 'SUMMARY' | 'DETAIL' | 'ANALYTICS' | 'DRILLDOWN';

export type ReportGenerationStatus = 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'FAILED';

export interface ReportDownloadInfo {
  downloadUrl: string;
  fileName: string;
}

export interface ReportStatusResponse {
  status: ReportGenerationStatus;
  downloadInfo?: ReportDownloadInfo;
}

export interface ReportDisplayInfo {
  tooltipKey: string;
  icon: string;
  downloadEnabled: boolean;
}
