import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, of } from 'rxjs';
import SharedModule from '../../shared/shared.module';
import packageJson from '../../../../../../package.json';
import { ProfileService } from '../profiles/profile.service';
import { InfoResponse } from '../profiles/profile-info.model';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
  imports: [SharedModule],
})
export default class FooterComponent {
  public feVersion: string = packageJson.version;
  public beVersion: string | null = null;
  public sertVersion: string = 'undefined';
  public ingestorVersion: string = 'undefined';
  private readonly defaultApimRoot = 'https://api.dev.platform.pagopa.it/smo';

  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);

  constructor() {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.beVersion = profileInfo.build?.version ?? 'undefined';
    });

    this.loadMicroserviceVersions();
  }

  private loadMicroserviceVersions(): void {
    const sertInfoUrl = this.buildServiceInfoUrl('cruscotto-sert');
    const ingestorInfoUrl = this.buildServiceInfoUrl('cruscotto-ingestor');

    const sertVersion$ = this.http.get<InfoResponse>(sertInfoUrl).pipe(
      map(response => response.build?.version ?? 'undefined'),
      catchError(() => of('undefined')),
    );

    const ingestorVersion$ = this.http.get<InfoResponse>(ingestorInfoUrl).pipe(
      map(response => response.build?.version ?? 'undefined'),
      catchError(() => of('undefined')),
    );

    forkJoin({ sertVersion: sertVersion$, ingestorVersion: ingestorVersion$ }).subscribe(({ sertVersion, ingestorVersion }) => {
      this.sertVersion = sertVersion;
      this.ingestorVersion = ingestorVersion;
    });
  }

  private buildServiceInfoUrl(serviceName: 'cruscotto-sert' | 'cruscotto-ingestor'): string {
    const serviceBaseUrl = SERVER_API_URL
      ? SERVER_API_URL.replace(/\/cruscotto\/v1\/?$/, `/${serviceName}/v1`).replace(/\/$/, '')
      : `${this.defaultApimRoot}/${serviceName}/v1`;
    return `${serviceBaseUrl}/management/info`;
  }
}
