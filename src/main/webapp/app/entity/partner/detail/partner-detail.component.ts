import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { IPartner } from '../partner.model';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';

@Component({
  selector: 'jhi-partner-detail',
  templateUrl: './partner-detail.component.html',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, FormatDatePipe, YesOrNoViewComponent],
})
export default class PartnerDetailComponent implements OnInit {
  partner: IPartner | null = null;
  locale: string;

  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner }) => {
      this.partner = partner;
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
