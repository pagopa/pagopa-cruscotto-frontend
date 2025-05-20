import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InstanceStatus, Instance } from '../models/instance.model';
import { InstanceService } from '../service/instance.service';
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
  @Input() instance: Instance | null = null;
  selectedModule: IInstanceModule | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly instanceService = inject(InstanceService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });

    this.route.params.subscribe(params => {
      const routeId = params['id'];
      console.log('Instance ID (via subscribe):', routeId);
      if (routeId) {
        this.loadInstance(routeId);
      }
    });

    // Seleziona il primo modulo (se l'istanza è già definita e ha moduli)
    if (this.instance) {
      const modules = this.instanceModulesSorted();
      if (modules.length > 0) {
        this.selectedModule = modules[0];
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  private loadInstance(id: number): void {
    // Chiama il servizio per ottenere i dettagli dell'istanza
    this.instanceService.find(id).subscribe({
      next: response => {
        this.instance = response.body; // `response.body` contiene l'istanza
        console.log('Instance loaded:', this.instance);
        // Seleziona il primo modulo se esiste
        const modules = this.instanceModulesSorted();
        if (modules.length > 0) {
          this.selectedModule = modules[0];
        }
      },
      error: error => {
        console.error('Error while fetching instance:', error);
      },
    });
  }

  /**
   * Restituisce l'elenco ordinato dei moduli.
   */
  instanceModulesSorted(): IInstanceModule[] {
    return (this.instance?.instanceModules || []).sort((a, b) => (a.moduleCode || '').localeCompare(b.moduleCode || ''));
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
