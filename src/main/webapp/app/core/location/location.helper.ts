import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocaltionHelper {
  protected isBack = false;

  getIsBack(): boolean {
    return this.isBack;
  }

  updateIsBack(isBack: boolean): void {
    this.isBack = isBack;
  }
}
