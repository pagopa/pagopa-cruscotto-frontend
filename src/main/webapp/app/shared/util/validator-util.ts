import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Dayjs } from 'dayjs';

export const datepickerRangeValidatorFn = (fromControlName: string, toControlName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);
    const start = fromControl ? (fromControl.value as Dayjs) : null;
    const end = toControl ? (toControl.value as Dayjs) : null;

    if (start && end) {
      if (end < start) {
        if (fromControl) {
          fromControl.setErrors({ ...fromControl.errors, ...{ matStartDateInvalid: true } });
        }
        /*if (toControl) {
		  toControl.setErrors({ ...toControl.errors, ...{ matEndDateInvalid: true } });
        }*/
      } else {
        if (fromControl) {
          const fromControlErrors = fromControl.errors ?? [];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete fromControlErrors['matStartDateInvalid'];

          fromControl.setErrors(Object.keys(fromControlErrors).length > 0 ? fromControlErrors : null);
        }
        if (toControl) {
          const toControlErrors = toControl.errors ?? [];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete toControlErrors['matEndDateInvalid'];

          toControl.setErrors(Object.keys(toControlErrors).length > 0 ? toControlErrors : null);
        }
      }
    } else {
      if (fromControl) {
        const fromControlErrors = fromControl.errors ?? [];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete fromControlErrors['matStartDateInvalid'];
        fromControl.setErrors(Object.keys(fromControlErrors).length > 0 ? fromControlErrors : null);
      }

      if (toControl) {
        const toControlErrors = toControl.errors ?? [];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete toControlErrors['matEndDateInvalid'];

        toControl.setErrors(Object.keys(toControlErrors).length > 0 ? toControlErrors : null);
      }
    }
    return null;
  };
};
