import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';
import { InstanceModuleService } from '../service/instance-module.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [CommonModule, DatePipe, MatCard, MatCardContent, TranslatePipe],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnChanges {
  @Input() moduleId?: number; // ID del modulo selezionato
  @Input() moduleCode?: string; // Codice del modulo selezionato
  @Input() moduleDetails?: IInstanceModule; // Riceve il modulo selezionato dal genitore

  constructor(private instanceModuleService: InstanceModuleService) {}

  ngOnChanges(): void {
    if (this.moduleId) {
      this.loadModuleDetails(this.moduleId);
    }
  }

  /**
   * Simula il caricamento dei dati dall'oggetto `IInstanceModule` ritornato da un backend.
   */
  loadModuleDetails(id: number): void {
    console.log('Caricamento dettagli per il modulo con ID:', id);

    this.instanceModuleService.getInstanceModule(id).subscribe({
      next: data => {
        this.moduleDetails = data;
        console.log('Dati ottenuti:', data);
      },
      error: error => {
        console.error('Errore:', error);
      },
    });

    console.log('Dati caricati per il modulo:', this.moduleDetails);
  }
}
