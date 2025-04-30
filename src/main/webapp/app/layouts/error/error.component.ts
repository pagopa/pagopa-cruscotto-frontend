import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import SharedModule from '../../shared/shared.module';
import { ErrorLayoutComponent } from '../error.layout';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'jhi-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [SharedModule, ErrorLayoutComponent, MatCardModule, MatButtonModule, RouterModule],
})
export class ErrorComponent implements OnInit, OnDestroy {
  errorMessage?: string;
  errorKey?: string;
  langChangeSubscription?: Subscription;

  private readonly translateService = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      if (routeData.errorMessage) {
        this.errorKey = routeData.errorMessage;
        this.getErrorMessageTranslation();
        this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => this.getErrorMessageTranslation());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  goToHome(): void {
    void this.router.navigate(['home']);
  }

  private getErrorMessageTranslation(): void {
    this.errorMessage = '';
    if (this.errorKey) {
      this.translateService.get(this.errorKey).subscribe(translatedErrorMessage => {
        this.errorMessage = translatedErrorMessage;
      });
    }
  }
}
