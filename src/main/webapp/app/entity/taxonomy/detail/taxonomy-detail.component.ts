import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { ITaxonomy } from '../taxonomy.model';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'jhi-taxonomy-detail',
  templateUrl: './taxonomy-detail.component.html',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, FormatDatePipe, MatIconButton, MatTooltip],
})
export default class TaxonomyDetailComponent implements OnInit {
  taxonomy: ITaxonomy | null = null;
  locale: string;

  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taxonomy }) => {
      this.taxonomy = taxonomy;
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
