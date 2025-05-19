import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IInstanceModule } from '../models/instance-module.model';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [CommonModule, DatePipe, MatCard, MatCardContent],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnChanges {
  @Input() moduleId?: number; // ID del modulo selezionato
  @Input() moduleCode?: string; // Codice del modulo selezionato
  @Input() moduleDetails?: IInstanceModule; // Riceve il modulo selezionato dal genitore

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
    // Debug per verificare i dati caricati
    console.log('Dati caricati per il modulo:', this.moduleDetails);
  }
}
