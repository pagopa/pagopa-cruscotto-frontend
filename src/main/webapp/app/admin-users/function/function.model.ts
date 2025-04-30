import { IPermission } from '../permission/permission.model';
import { IGroup } from '../group/group.model';

export interface IFunction {
  id: number;
  nome?: string | null;
  modulo?: string | null;
  descrizione?: string | null;
  type?: string | null;
  selected?: boolean | null;
  authPermissions?: IPermission[] | null;
  authGroups?: IGroup[] | null;
}

export type NewFunction = Omit<IFunction, 'id'> & { id: null; type: 'function' };
