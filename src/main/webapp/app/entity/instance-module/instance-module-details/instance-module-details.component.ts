import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';
import { InstanceModuleService } from '../service/instance-module.service';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { KpiB2ResultTableComponent } from '../../kpi/kpi-b2/kpi-b2-result-table/kpi-b2-result-table.component';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [CommonModule, MatCard, MatCardContent, TranslatePipe, FormatDatePipe, KpiB2ResultTableComponent],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnInit, OnChanges {
  @Input() moduleId?: number;
  moduleDetails?: IInstanceModule;

  locale: string;
  private readonly translateService = inject(TranslateService);

  constructor(private instanceModuleService: InstanceModuleService) {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.moduleId) {
      this.loadModuleDetails(this.moduleId);
    }
  }

  /**
   * Simula il caricamento dei dettagli di un modulo da backend
   * e memorizza i dati in una proprietà pubblica.
   */
  loadModuleDetails(id: number): void {
    console.log('Caricamento dettagli per il modulo con ID:', id);

    this.instanceModuleService.find(id).subscribe({
      next: res => {
        if (res.body) {
          this.moduleDetails = res.body;
          console.log('Dati ottenuti:', this.moduleDetails);
        }
      },
      error: error => {
        console.error('Errore durante il caricamento:', error);
      },
    });
  }
}
