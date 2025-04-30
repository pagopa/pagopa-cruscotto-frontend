import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPermission, NewPermission } from '../permission.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPermission for edit and NewPermission for create.
 */
type PermissionFormGroupInput = IPermission | PartialWithRequiredKeyOf<NewPermission>;

type PermissionFormDefaults = Pick<NewPermission, 'id'>;

type PermissionFormGroupContent = {
  id: FormControl<IPermission['id'] | NewPermission['id']>;
  nome: FormControl<IPermission['nome']>;
  modulo: FormControl<IPermission['modulo']>;
};

export type PermissionFormGroup = FormGroup<PermissionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PermissionFormService {
  createPermissionFormGroup(permission: PermissionFormGroupInput = { id: null }): PermissionFormGroup {
    const permissionRawValue = {
      ...this.getFormDefaults(),
      ...permission,
    };
    return new FormGroup<PermissionFormGroupContent>({
      id: new FormControl(
        { value: permissionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(permissionRawValue.nome, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)],
      }),
      modulo: new FormControl(permissionRawValue.modulo, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getPermission(form: PermissionFormGroup): IPermission | NewPermission {
    return form.getRawValue() as IPermission | NewPermission;
  }

  resetForm(form: PermissionFormGroup, permission: PermissionFormGroupInput): void {
    const permissionRawValue = { ...this.getFormDefaults(), ...permission };
    form.reset(
      {
        ...permissionRawValue,
        id: { value: permissionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PermissionFormDefaults {
    return {
      id: null,
    };
  }
}
