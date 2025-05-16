import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { FormatDatePipe } from '../../../shared/date';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InstanceStatus, Instance } from '../instance.model';

@Component({
  selector: 'jhi-instance-detail',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, FormatDatePipe],
  templateUrl: './instance-detail.component.html',
  styleUrl: './instance-detail.component.scss',
})
export class InstanceDetailComponent implements OnInit {
  locale: string;
  status = InstanceStatus;
  @Input() instance: Instance | null = null;

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
