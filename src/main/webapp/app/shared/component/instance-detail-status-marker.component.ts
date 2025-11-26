import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnalysisOutcome } from 'app/entity/instance-module/models/analysis-outcome.model';
import { ModuleStatus } from 'app/entity/instance-module/models/module-status.model';

type StatusMarkerType = 'outcome' | 'condition';

@Component({
  selector: 'jhi-detail-status-marker',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `<span
    *ngIf="show"
    [ngClass]="{
      'status-ko': status === 'ko',
    }"
  ></span>`,
  styles: `
    span {
      border-radius: 50%;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      display: block;
    }
    // .status-ok {
    //   background-color: green;
    // }
    .status-ko {
      background-color: red;
    }
  `,
})
export class DetailStatusMarkerComponent {
  @Input({ required: true }) type!: StatusMarkerType;

  @Input() outcome?: AnalysisOutcome;
  @Input() condition?: boolean;

  get show(): boolean {
    if (this.type === 'condition') {
      return this.condition === true;
    }
    return this.outcome !== undefined;
  }

  // get status(): 'ok' | 'ko' | null {
  get status(): 'ko' | null {
    if (this.type === 'condition') {
      return this.condition ? 'ko' : null;
    }

    // if (this.outcome === AnalysisOutcome.OK) return 'ok';
    if (this.outcome === AnalysisOutcome.KO) return 'ko';
    return null;
  }
}
