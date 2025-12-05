import { Component } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import packageJson from '../../../../../../package.json';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
  imports: [SharedModule],
})
export default class FooterComponent {
  public version: string = packageJson.version;

  // private readonly profileService = inject(ProfileService);

  // constructor() {
  //   this.profileService.getProfileInfo().subscribe(profileInfo => {
  //     this.version = profileInfo.build?.version ?? 'undefined';
  //   });
  // }
}
