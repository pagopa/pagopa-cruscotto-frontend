import { Component, Input, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuItem } from '../../../shared/model/menu-item.model';

@Component({
  standalone: true,
  selector: 'jhi-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './menu-item.component.html',
  imports: [SharedModule, MatMenuModule, MatIconModule, RouterModule, MatButtonModule],
})
export default class MenuItemComponent {
  @Input() items?: MenuItem[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) {}

  isActive(items: MenuItem[]): boolean {
    let active = false;

    items.forEach(firstLevel => {
      if (firstLevel.route) {
        active =
          active ||
          this.router.isActive(firstLevel.route, {
            paths: 'exact',
            matrixParams: 'exact',
            queryParams: 'exact',
            fragment: 'exact',
          });
      }

      if (firstLevel.children) {
        firstLevel.children.forEach(secondLevel => {
          if (secondLevel.route) {
            active =
              active ||
              this.router.isActive(secondLevel.route, {
                paths: 'exact',
                matrixParams: 'exact',
                queryParams: 'exact',
                fragment: 'exact',
              });
          }
        });
      }
    });

    return active;
  }
}
