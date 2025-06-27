import dayjs from 'dayjs/esm';

export interface IJob {
  schedulerName: string;
  jobName: string;
  groupName: string;
  scheduleTime?: dayjs.Dayjs | null;
  lastFiredTime?: dayjs.Dayjs | null;
  nextFireTime?: dayjs.Dayjs | null;
  jobStatus: string;
  cron: string;
}

export interface DialogJobData {
  job: IJob;
}

export interface IJobExecution {
  id: number;
  fireInstanceId?: string | null;
  schedulerName?: string | null;
  jobName?: string | null;
  jobGroup?: string | null;
  scheduledTime?: dayjs.Dayjs | null;
  triggerGroup?: string | null;
  triggerName?: string | null;
  initFiredTime?: dayjs.Dayjs | null;
  endFiredTime?: dayjs.Dayjs | null;
  state?: string | null;
  messageException?: string | null;
}
