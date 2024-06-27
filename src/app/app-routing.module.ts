import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/price-alert', pathMatch: 'full'},
      {path: 'portfolio', loadChildren: () => import('./component/portfolio/portfolio.module').then(m => m.PortfolioModule)},
      {path: 'price-alert', loadChildren: () => import('./component/price-alert/price-alert.module').then(m => m.PriceAlertModule)},
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
