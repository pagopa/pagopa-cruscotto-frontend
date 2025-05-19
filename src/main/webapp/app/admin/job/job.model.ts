import dayjs from 'dayjs/esm';

export interface IJob {
  jobName: string;
  groupName: string;
  scheduleTime?: dayjs.Dayjs | null;
  lastFiredTime?: dayjs.Dayjs | null;
  nextFireTime?: dayjs.Dayjs | null;
  jobStatus: string;
}

export interface DialogJobData {
  job: IJob;
}
