import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IInstance, InstanceStatus } from '../models/instance.model';
import { IInstanceModule } from '../../instance-module/models/instance-module.model';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { InstanceModuleDetailsComponent } from '../../instance-module/instance-module-details/instance-module-details.component';
import { MatTooltip } from '@angular/material/tooltip';
import FormatDatePipe from '../../../shared/date/format-date.pipe';

@Component({
  selector: 'jhi-instance-detail',
  imports: [
    RouterModule,
    SharedModule,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatTabNav,
    MatTabNavPanel,
    InstanceModuleDetailsComponent,
    MatTabLink,
    MatTooltip,
    FormatDatePipe,
  ],
  templateUrl: './instance-detail.component.html',
  styleUrl: './instance-detail.component.scss',
})
export class InstanceDetailComponent implements OnInit {
  locale: string;
  status = InstanceStatus;
  instance = input<IInstance | null>(null);
  selectedModule: IInstanceModule | null = null;

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });

    // Preseleziona il primo modulo se disponibile
    const sortedModules = this.instanceModulesSorted();
    if (sortedModules && sortedModules.length > 0) {
      this.selectModule(sortedModules[0]); // Seleziona il primo modulo
    }
  }

  previousState(): void {
    window.history.back();
  }

  /**
   * Restituisce l'elenco ordinato dei moduli.
   */
  instanceModulesSorted(): IInstanceModule[] {
    const currentInstance = this.instance(); // Recupera il valore attuale del segnale
    return (currentInstance?.instanceModules || []).sort((a, b) => (a.moduleCode || '').localeCompare(b.moduleCode || ''));
  }

  /**
   * Seleziona un modulo al clic.
   * @param module Modulo che si intende selezionare.
   */
  selectModule(module: IInstanceModule): void {
    this.selectedModule = module;
    console.log('Modulo selezionato:', this.selectedModule);
  }
}
