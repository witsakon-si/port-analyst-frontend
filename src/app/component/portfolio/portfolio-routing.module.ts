import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {PortfolioComponent} from "./portfolio.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: PortfolioComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PortfolioRoutingModule {
}
