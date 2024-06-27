import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {PriceAlertComponent} from "./price-alert.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: PriceAlertComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PriceAlertRoutingModule {
}
