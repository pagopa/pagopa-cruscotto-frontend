import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { AnalysisOutcome } from 'app/entity/instance-module/models/analysis-outcome.model';

@Component({
  selector: 'jhi-status-marker',
  template: `<span [ngClass]="'status-' + status">●</span>`,
  styles: ['.status-OK { color: green} ', '.status-KO {color: red}', '.status-STANDBY {color: orange}'],
  imports: [NgClass],
})
export class StatusMarkerComponent {
  status = input<AnalysisOutcome>();
}
