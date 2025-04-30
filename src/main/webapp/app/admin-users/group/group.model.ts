import { IFunction } from '../function/function.model';

export interface IGroup {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  livelloVisibilita?: number | null;
  authFunctions?: IFunction[] | null;
}

export type NewGroup = Omit<IGroup, 'id'> & { id: null };
