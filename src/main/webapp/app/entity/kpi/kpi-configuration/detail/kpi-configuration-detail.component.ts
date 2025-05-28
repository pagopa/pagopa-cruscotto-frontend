import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IKpiConfiguration } from '../kpi-configuration.model';
import { YesOrNoViewComponent } from '../../../../shared/component/yes-or-no-view.component';
import { AverageFormatPipe } from '../../../../shared/pipes/average-format.pipe';

@Component({
  selector: 'jhi-kpi-configuration-detail',
  templateUrl: './kpi-configuration-detail.component.html',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, YesOrNoViewComponent, AverageFormatPipe],
})
export default class KpiConfigurationDetailComponent implements OnInit {
  kpiConfiguration: IKpiConfiguration | null = null;
  locale: string;

  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kpiConfiguration }) => {
      this.kpiConfiguration = kpiConfiguration;
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
