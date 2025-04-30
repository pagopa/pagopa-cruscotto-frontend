import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, inject, input, effect, computed } from '@angular/core';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { MenuItem } from '../model/menu-item.model';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *jhiHasAnyAuthorityMenu="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *jhiHasAnyAuthorityMenu="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[jhiHasAnyAuthorityMenu]',
})
export class HasAnyAuthorityMenuDirective {
  public menuItems = input<MenuItem | MenuItem[]>([], { alias: 'jhiHasAnyAuthorityMenu' });

  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const accountService = inject(AccountService);
    const currentAccount = accountService.trackCurrentAccount();

    const hasPermission = computed(() => {
      const authorities = this.authority(this.menuItems());

      if ((currentAccount()?.authorities && accountService.hasAnyAuthority(authorities)) || authorities.length === 0) {
        return true;
      }

      return false;
    });

    effect(() => {
      if (hasPermission()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  authority(items: MenuItem | MenuItem[]): string[] | string {
    const authority: string[] = [];

    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach((firstLevel: MenuItem) => {
      if (firstLevel.permission && !authority.includes(firstLevel.permission)) {
        authority.push(firstLevel.permission);
      }

      if (firstLevel.children) {
        firstLevel.children.forEach((secondLevel: MenuItem) => {
          if (secondLevel.permission && !authority.includes(secondLevel.permission)) {
            authority.push(secondLevel.permission);
          }
          if (secondLevel.children) {
            secondLevel.children.forEach((thirdLevel: MenuItem) => {
              if (thirdLevel.permission && !authority.includes(thirdLevel.permission)) {
                authority.push(thirdLevel.permission);
              }
            });
          }
        });
      }
    });

    return authority;
  }
}
