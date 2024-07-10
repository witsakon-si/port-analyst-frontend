import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {Oauth2RedirectHandlerComponent} from "./auth/oauth2-redirect-handler/oauth2-redirect-handler.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'portfolio', loadChildren: () => import('./component/portfolio/portfolio.module').then(m => m.PortfolioModule)},
      {path: 'price-alert', loadChildren: () => import('./component/price-alert/price-alert.module').then(m => m.PriceAlertModule)},
      {path: 'login', loadChildren: () => import('./component/login/login.module').then(m => m.LoginModule)},
      {path: 'oauth2/:provider/redirect', component: Oauth2RedirectHandlerComponent},
      {path: '**', redirectTo: 'login'}
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
