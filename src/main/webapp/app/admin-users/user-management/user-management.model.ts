import dayjs from 'dayjs/esm';

export interface IUser {
  id: number | null;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string;
  lastModifiedDate?: dayjs.Dayjs | null;
  password?: string;
  groupId?: number;
  groupName?: string;
  blocked?: boolean;
  deleted?: boolean;
  deletedDate?: dayjs.Dayjs | null;
  authenticationType?: string;
}

export type NewUser = Omit<IUser, 'id'> & { id: null };

export class User implements IUser {
  constructor(
    public id: number | null,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: string[],
    public createdBy?: string,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public password?: string,
    public groupId?: number,
    public groupName?: string,
    public blocked?: boolean,
    public deleted?: boolean,
    public deletedDate?: dayjs.Dayjs | null,
    public authenticationType?: string,
  ) {}
}
