import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IFunction, NewFunction } from '../function.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFunction for edit and NewFunction for create.
 */
type FunctionFormGroupInput = IFunction | PartialWithRequiredKeyOf<NewFunction>;

type FunctionFormDefaults = Pick<NewFunction, 'id'>;

type FunctionFormGroupContent = {
  id: FormControl<IFunction['id'] | NewFunction['id']>;
  nome: FormControl<IFunction['nome']>;
  modulo: FormControl<IFunction['modulo']>;
  descrizione: FormControl<IFunction['descrizione']>;
};

export type FunctionFormGroup = FormGroup<FunctionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FunctionFormService {
  createFunctionFormGroup(input: FunctionFormGroupInput = { id: null }): FunctionFormGroup {
    const FunctionRawValue = {
      ...this.getFormDefaults(),
      ...input,
    };
    return new FormGroup<FunctionFormGroupContent>({
      id: new FormControl(
        { value: FunctionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(FunctionRawValue.nome, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      modulo: new FormControl(FunctionRawValue.modulo, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      descrizione: new FormControl(FunctionRawValue.descrizione, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)],
      }),
    });
  }

  getFunction(form: FunctionFormGroup): IFunction | NewFunction {
    return form.getRawValue() as IFunction | NewFunction;
  }

  resetForm(form: FunctionFormGroup, input: FunctionFormGroupInput): void {
    const FunctionRawValue = { ...this.getFormDefaults(), ...input };
    form.reset(
      {
        ...FunctionRawValue,
        id: { value: FunctionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FunctionFormDefaults {
    return {
      id: null,
    };
  }
}
