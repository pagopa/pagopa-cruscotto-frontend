import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

const ITEMS_PER_PAGE = 'global.paginator.items-for-page';
const NEXT_PAGE = 'global.paginator.next-page';
const PREV_PAGE = 'global.paginator.prev-page';
const FIRST_PAGE = 'global.paginator.first-page';
const LAST_PAGE = 'global.paginator.last-page';

@Injectable()
export class MatPaginatorI18nService extends MatPaginatorIntl {
  public constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  public getAndInitTranslations(): void {
    this.translate.get([ITEMS_PER_PAGE, NEXT_PAGE, PREV_PAGE, FIRST_PAGE, LAST_PAGE]).subscribe((translation: any) => {
      this.itemsPerPageLabel = translation[ITEMS_PER_PAGE];
      this.nextPageLabel = translation[NEXT_PAGE];
      this.previousPageLabel = translation[PREV_PAGE];
      this.firstPageLabel = translation[FIRST_PAGE];
      this.lastPageLabel = translation[LAST_PAGE];

      this.changes.next();
    });
  }
}
