import { NgModule } from '@angular/core';
import SharedModule from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { Error404Component } from './404.component';
import { ErrorComponent } from './error.component';
import { LanguageService } from 'app/shared/language/language.service';
import { MatCardModule } from '@angular/material/card';
import { ErrorLayoutComponent } from '../error.layout';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [SharedModule, RouterModule, MatCardModule, MatButtonModule],
  declarations: [Error404Component, ErrorComponent, ErrorLayoutComponent],
  providers: [{ provide: LanguageService, useClass: LanguageService }],
})
export class ErrorModule {}
