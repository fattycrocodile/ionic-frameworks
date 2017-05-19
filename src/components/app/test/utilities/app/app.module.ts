import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page/root-page';

@NgModule({
  declarations: [
    AppComponent,
    RootPage
  ],
  entryComponents: [
    RootPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, { statusbarPadding: true })
  ],
  bootstrap: [IonicApp],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
