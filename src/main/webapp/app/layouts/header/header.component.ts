import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Authority } from '../../config/authority.constants';
import { AccountService } from '../../core/auth/account.service';
import { LoginService } from '../../login/login.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import SharedModule from '../../shared/shared.module';
import LanguagePickerComponent from './language-picker/language-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import MenuItemComponent from './menu-item/menu-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '../../shared/model/menu-item.model';

@Component({
  standalone: true,
  selector: 'jhi-ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  imports: [
    SharedModule,
    MatToolbarModule,
    RouterModule,
    LanguagePickerComponent,
    MatButtonModule,
    MenuItemComponent,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatListModule,
  ],
})
export default class HeaderComponent implements OnInit, OnDestroy {
  @Input() position = 'normal';

  @Input() showSidenav = false;

  @Input() sidenav?: MatSidenav;

  @ViewChild('manageAccounts', { static: true }) public manageAccounts: any;

  account = inject(AccountService).trackCurrentAccount();

  menuItems: MenuItem[] = [
    {
      label: 'global.menu.instance.main',
      route: '/entity/instances',
      permission: Authority.GTW_STRUMENTI_CONTROLLO,
      xSmall: false,
      small: false,
      medium: true,
      large: true,
    },
    {
      label: 'global.menu.shutdown.main',
      route: '/entity/shutdowns',
      permission: Authority.GTW_STRUMENTI_CONTROLLO,
      xSmall: false,
      small: false,
      medium: true,
      large: true,
    },
    {
      label: 'global.menu.taxonomy.main',
      route: '/entity/taxonomies',
      permission: Authority.GTW_STRUMENTI_CONTROLLO,
      xSmall: false,
      small: false,
      medium: true,
      large: true,
    },
    {
      label: 'global.menu.kpiConfiguration.main',
      route: '/entity/kpi-configurations',
      permission: Authority.GTW_STRUMENTI_CONTROLLO,
      xSmall: false,
      small: false,
      medium: true,
      large: true,
    },
    {
      label: 'global.menu.usersAdministration.main',
      xSmall: false,
      small: false,
      medium: true,
      large: true,
      children: [
        {
          label: 'global.menu.usersAdministration.users',
          route: '/admin-users/user-management',
          permission: Authority.GTW_ELENCO_UTENTI,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
        {
          label: 'global.menu.usersAdministration.groupManagement',
          route: '/admin-users/groups',
          permission: Authority.GTW_ELENCO_GRUPPI,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
        {
          label: 'global.menu.usersAdministration.functionManagement',
          route: '/admin-users/functions',
          permission: Authority.GTW_ELENCO_FUNZIONI,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
        {
          label: 'global.menu.usersAdministration.permissionManagement',
          route: '/admin-users/permissions',
          permission: Authority.GTW_ELENCO_PERMESSI,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
      ],
    },
    {
      label: 'global.menu.systemAdministration.main',
      xSmall: false,
      small: false,
      medium: true,
      large: true,
      children: [
        {
          label: 'global.menu.systemAdministration.metrics',
          route: '/admin/metrics',
          permission: Authority.GTW_STRUMENTI_CONTROLLO,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
        {
          label: 'global.menu.systemAdministration.apiDocs',
          route: '/admin/docs',
          permission: Authority.GTW_STRUMENTI_CONTROLLO,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
        {
          label: 'global.menu.systemAdministration.jobs',
          route: '/admin/jobs',
          permission: Authority.GTW_STRUMENTI_CONTROLLO,
          xSmall: true,
          small: true,
          medium: true,
          large: true,
        },
      ],
    },
  ];

  destroyed = new Subject();
  currentRange?: 'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge';

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
          this.currentRange = 'XSmall';
        }
        if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
          this.currentRange = 'Small';
        }
        if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
          this.currentRange = 'Medium';
        }
        if (this.breakpointObserver.isMatched(Breakpoints.Large) || this.breakpointObserver.isMatched(Breakpoints.XLarge)) {
          this.currentRange = 'Large';
        }
      });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  hasAuthorityChangePasswordExpired(): boolean {
    return this.accountService.hasAnyAuthority(Authority.CHANGE_PASSWORD_EXPIRED);
  }

  goToSettings(): void {
    if (this.isAuthenticated()) {
      void this.router.navigate(['/account/settings']);
    } else {
      void this.router.navigate(['account/login']);
    }
  }

  logout(): void {
    this.loginService.logout();
    void this.router.navigate(['']);
  }

  isActive(items: MenuItem[]): boolean {
    let active = false;

    items.forEach(firstLevel => {
      if (firstLevel.route) {
        active =
          active ||
          this.router.isActive(firstLevel.route, { paths: 'subset', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' });
      }

      if (firstLevel.children) {
        firstLevel.children.forEach((secondLevel: MenuItem) => {
          if (secondLevel.route) {
            active =
              active ||
              this.router.isActive(secondLevel.route, {
                paths: 'subset',
                queryParams: 'exact',
                fragment: 'ignored',
                matrixParams: 'ignored',
              });
          }
        });
      }
    });

    return active;
  }

  ngOnDestroy(): void {
    this.destroyed.next(null);
    this.destroyed.complete();
  }
}
