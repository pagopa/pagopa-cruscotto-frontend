import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { MatTimepickerIntl } from '@dhutaryan/ngx-mat-timepicker';
@Injectable()
export class MatTimepickerI18nService extends MatTimepickerIntl {
  protected CANCEL_BUTTON = 'global.timepicker.button.cancel';
  protected OK_BUTTON = 'global.timepicker.button.confirm';
  protected INPUTS_TITLE = 'global.timepicker.inputsTitle';
  protected DIALS_TITLE = 'global.timepicker.dialsTitle';
  protected HOUR = 'global.timepicker.hour';
  protected MINUTE = 'global.timepicker.minute';
  protected OPEN_TIMEPICKER_LABEL = 'global.timepicker.openTimepickerLabel';
  protected CLOSE_TIMEPICKER_LABEL = 'global.timepicker.closeTimepickerLabel';
  protected AM = 'global.timepicker.am';
  protected PM = 'global.timepicker.pm';
  public constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }
  public getAndInitTranslations(): void {
    this.translate
      .get([
        this.CANCEL_BUTTON,
        this.OK_BUTTON,
        this.INPUTS_TITLE,
        this.DIALS_TITLE,
        this.HOUR,
        this.MINUTE,
        this.OPEN_TIMEPICKER_LABEL,
        this.CLOSE_TIMEPICKER_LABEL,
        this.AM,
        this.PM,
      ])
      .subscribe((translation: any) => {
        this.cancelButton = translation[this.CANCEL_BUTTON];
        this.okButton = translation[this.OK_BUTTON];
        this.inputsTitle = translation[this.INPUTS_TITLE];
        this.dialsTitle = translation[this.DIALS_TITLE];
        this.hourInputHint = translation[this.HOUR];
        this.minuteInputHint = translation[this.MINUTE];
        this.openTimepickerLabel = translation[this.OPEN_TIMEPICKER_LABEL];
        this.closeTimepickerLabel = translation[this.CLOSE_TIMEPICKER_LABEL];
        this.am = translation[this.AM];
        this.pm = translation[this.PM];
        this.changes.next();
      });
  }
}
