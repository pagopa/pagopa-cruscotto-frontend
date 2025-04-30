import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IGroup, NewGroup } from '../group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGroup for edit and NewGroup for create.
 */
type GroupFormGroupInput = IGroup | PartialWithRequiredKeyOf<NewGroup>;

type GroupFormDefaults = Pick<NewGroup, 'id'>;

type GroupFormGroupContent = {
  id: FormControl<IGroup['id'] | NewGroup['id']>;
  nome: FormControl<IGroup['nome']>;
  descrizione: FormControl<IGroup['descrizione']>;
};

export type GroupFormGroup = FormGroup<GroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupFormService {
  createGroupFormGroup(input: GroupFormGroupInput = { id: null }): GroupFormGroup {
    const GroupRawValue = {
      ...this.getFormDefaults(),
      ...input,
    };
    return new FormGroup<GroupFormGroupContent>({
      id: new FormControl(
        { value: GroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(GroupRawValue.nome, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      descrizione: new FormControl(GroupRawValue.descrizione, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)],
      }),
    });
  }

  getGroup(form: GroupFormGroup): IGroup | NewGroup {
    return form.getRawValue() as IGroup | NewGroup;
  }

  resetForm(form: GroupFormGroup, input: GroupFormGroupInput): void {
    const GroupRawValue = { ...this.getFormDefaults(), ...input };
    form.reset(
      {
        ...GroupRawValue,
        id: { value: GroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GroupFormDefaults {
    return {
      id: null,
    };
  }
}
