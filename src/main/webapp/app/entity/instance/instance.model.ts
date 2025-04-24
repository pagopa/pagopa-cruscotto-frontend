export interface IInstance {
  id: number;
  instanceIdentification?: string | null;
}

export type NewInstance = Omit<IInstance, 'id'> & { id: null };
