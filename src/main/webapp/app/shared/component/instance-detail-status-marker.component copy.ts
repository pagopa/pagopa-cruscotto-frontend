import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnalysisOutcome } from 'app/entity/instance-module/models/analysis-outcome.model';
import { ModuleStatus } from 'app/entity/instance-module/models/module-status.model';
import { IInstanceModule } from 'app/entity/instance-module/models/instance-module.model';

@Component({
  selector: 'jhi-status-marker',
  template: `<span
    [ngClass]="{
      'status-ok': module.outcome === AnalysisOutcome.OK,
      'status-ko': module.outcome === AnalysisOutcome.KO,
    }"
  ></span>`,
  styles: `
    span {
      border-radius: 50%;
      width: 10px;
      height: 10px;
      margin-left: 8px;
      display: block;
      // &:after { font-size: 24px; display: block; transform: translate(-5px, -7px)}
    }
    .status-unactive {
      display: none;
    }
    .status-standby {
      background-color: orange;
    }
    .status-ok {
      background-color: green;
      // &:after {content: "✓"};
    }
    .status-ko {
      background-color: red;
      // &:after {content: "✗";}
    }
  `,
  imports: [NgClass],
})
export class StatusMarkerComponent {
  @Input() module!: any;
  ModuleStatus = ModuleStatus;
  AnalysisOutcome = AnalysisOutcome;
}
