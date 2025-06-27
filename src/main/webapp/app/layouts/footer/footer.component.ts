import { Component, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ProfileService } from '../profiles/profile.service';
import SharedModule from '../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
  imports: [SharedModule],
})
export default class FooterComponent {
  version = '';
  private readonly profileService = inject(ProfileService);

  constructor() {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.version = profileInfo.build?.version ?? 'undefined';
    });
  }
}
