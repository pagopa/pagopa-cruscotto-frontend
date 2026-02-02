import { Component, inject } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import packageJson from '../../../../../../package.json';
import { ProfileService } from '../profiles/profile.service';

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

  private readonly profileService = inject(ProfileService);

  constructor() {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.beVersion = profileInfo.build?.version ?? 'undefined';
    });
  }
}
