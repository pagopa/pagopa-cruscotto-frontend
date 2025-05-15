import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';

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

export const timeValidatorFn = (
  fromDateControlName: string,
  toDateControlName: string,
  fromTimeControlName: string,
  toTimeControlName: string,
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromControl = control.get(fromDateControlName);
    const toControl = control.get(toDateControlName);
    const fromTimeControl = control.get(fromTimeControlName);
    const toTimeControl = control.get(toTimeControlName);
    const startDate = fromControl ? (fromControl.value as dayjs.Dayjs) : null;
    const endDate = toControl ? (toControl.value as dayjs.Dayjs) : null;
    const startTime = fromTimeControl ? (fromTimeControl.value as Date) : null;
    const endTime = toTimeControl ? (toTimeControl.value as Date) : null;
    let notDateError = true;
    let notTimeError = true;
    let notCurrentDateError = true;
    let notCurrentTimeError = true;
    if (startDate && endDate && startTime && endTime) {
      const now = dayjs(dayjs().second(0).millisecond(0));
      const nowStart: dayjs.Dayjs = dayjs().hour(startTime.getHours()).minute(startTime.getMinutes()).second(0).millisecond(0);
      const nowEnd = dayjs(dayjs().hour(endTime.getHours()).minute(endTime.getMinutes()).second(0).millisecond(0));

      if (endDate.diff(startDate, 'days') < 0) {
        notDateError = false;
        if (fromControl) {
          fromControl.setErrors({
            ...fromControl.errors,
            ...{
              dateMax: true,
            },
          });
        }
        if (toControl) {
          toControl.setErrors({
            ...toControl.errors,
            ...{
              dateMin: true,
            },
          });
        }
      } else if (endDate.diff(startDate, 'days') == 0 && (nowEnd.isBefore(nowStart) || nowEnd.isSame(nowStart))) {
        notTimeError = false;
        if (fromTimeControl) {
          fromTimeControl.setErrors({
            ...fromTimeControl.errors,
            ...{
              timeMax: true,
            },
          });
        }
        if (toTimeControl) {
          toTimeControl.setErrors({
            ...toTimeControl.errors,
            ...{
              timeMin: true,
            },
          });
        }
      }

      if (notDateError) {
        if (fromControl) {
          const errors = fromControl.errors ?? [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete errors['dateMax'];
          fromControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        if (toControl) {
          const errors = toControl.errors ?? [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete errors['dateMin'];
          toControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      if (notTimeError) {
        if (fromTimeControl) {
          const errors = fromTimeControl.errors ?? [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete errors['timeMax'];
          fromTimeControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        if (toTimeControl) {
          const errors = toTimeControl.errors ?? [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete errors['timeMin'];
          toTimeControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }
    }
    return null;
  };
};
