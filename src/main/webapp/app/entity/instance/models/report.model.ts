export interface GenerateReportRequest {
  instanceIds: number[];
  reportType?: ReportType;
  variant?: string;
  language: string;
  startDate: string;
  endDate: string;
  parameters?: Record<string, any>;
}

export type ReportType = 'SUMMARY' | 'DETAIL' | 'ANALYTICS' | 'DRILLDOWN';
