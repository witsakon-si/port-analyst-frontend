import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MenubarModule} from 'primeng/menubar';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {LoadingService} from "./service/loadingService";
import {AppConfigService} from "./service/appconfigservice";
import {ModalComponent} from "./shared/modal/modal.component";
import {ButtonModule} from "primeng/button";
import {authenticationInterceptor} from "./auth/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    ButtonModule,
  ],
  providers: [
    LoadingService,
    AppConfigService,
    provideHttpClient(withInterceptors([authenticationInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
