import { IFunction } from '../function/function.model';

export interface IPermission {
  id: number;
  nome?: string | null;
  modulo?: string | null;
  type?: string | null;
  authFunctions?: IFunction[];
}

export type NewPermission = Omit<IPermission, 'id'> & { id: null; type: 'permission' };
