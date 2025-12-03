import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnalysisOutcome } from 'app/entity/instance-module/models/analysis-outcome.model';
import { ModuleStatus } from 'app/entity/instance-module/models/module-status.model';

type StatusMarkerType = 'outcome' | 'condition';

@Component({
  selector: 'jhi-detail-status-marker',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    <span *ngIf="type === 'condition' && condition" class="dot dot-ko"></span>

    <span
      *ngIf="type === 'outcome'"
      [ngClass]="{
        'outcome-ok': outcome === AnalysisOutcome.OK,
        'outcome-ko': outcome === AnalysisOutcome.KO,
      }"
      class="outcome-text"
    >
      {{ outcome }}
    </span>
  `,
  styles: `
    .dot {
      border-radius: 50%;
      width: 12px;
      height: 12px;
      display: inline-block;
    }
    .dot-ko {
      background-color: red;
    }
    .outcome-text {
      font-weight: 500;
    }
    .outcome-ok {
      color: green;
      font-weight: bold;
    }
    .outcome-ko {
      color: red;
      font-weight: bold;
    }
  `,
})
export class DetailStatusMarkerComponent {
  @Input({ required: true }) type!: StatusMarkerType;

  @Input() outcome?: AnalysisOutcome;
  @Input() condition?: boolean;

  AnalysisOutcome = AnalysisOutcome;
}
