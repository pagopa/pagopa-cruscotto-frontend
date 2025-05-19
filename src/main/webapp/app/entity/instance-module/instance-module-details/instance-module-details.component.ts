import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'jhi-instance-module-details',
  imports: [CommonModule, DatePipe, MatCard, MatCardContent],
  templateUrl: './instance-module-details.component.html',
  styleUrl: './instance-module-details.component.scss',
})
export class InstanceModuleDetailsComponent implements OnChanges {
  @Input() moduleId?: number; // ID del modulo selezionato
  @Input() moduleCode?: string; // Codice del modulo selezionato

  // Proprietà che mostrano i dettagli del modulo
  analysisDate?: Date;
  eligibilityThreshold?: number;
  evaluationType?: string;

  ngOnChanges(): void {
    if (this.moduleId) {
      this.loadModuleDetails(this.moduleId);
    }
  }

  /**
   * Simula il caricamento dei dati dalla tabella `kpi_a1_result`.
   */
  loadModuleDetails(id: number): void {
    console.log('Caricamento dettagli per il modulo con ID:', id);

    // Simulazione: Da sostituire con una chiamata al backend HTTP
    if (id === 1) {
      this.analysisDate = new Date();
      this.eligibilityThreshold = 85;
      this.evaluationType = 'Automatic';
    } else {
      this.analysisDate = new Date();
      this.eligibilityThreshold = 90;
      this.evaluationType = 'Manual';
    }
  }
}
