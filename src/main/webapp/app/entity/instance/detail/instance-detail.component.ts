import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { FormatDatePipe } from '../../../shared/date';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InstanceStatus, Instance } from '../instance.model';
import { InstanceService } from '../service/instance.service';

@Component({
  selector: 'jhi-instance-detail',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, FormatDatePipe],
  templateUrl: './instance-detail.component.html',
  styleUrl: './instance-detail.component.scss',
})
export class InstanceDetailComponent implements OnInit {
  locale: string;
  status = InstanceStatus;
  @Input() instance: Instance | null = null;

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
      },
      error: error => {
        console.error('Error while fetching instance:', error);
      },
    });
  }
}
