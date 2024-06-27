import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PriceAlertComponent} from "./price-alert.component";
import {PriceAlertRoutingModule} from "./price-alert-routing.module";

import {ChartModule} from 'primeng/chart';
import {CarouselModule} from "primeng/carousel";

import {AppConfigService} from "../../service/appconfigservice";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {SplitterModule} from "primeng/splitter";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SelectButtonModule} from "primeng/selectbutton";
import {MultiSelectModule} from "primeng/multiselect";
import {ToastModule} from "primeng/toast";
import {InputTextareaModule} from "primeng/inputtextarea";
import {AutoCompleteModule} from "primeng/autocomplete";
import {SharedModule} from "../../shared/shared.module";
import {PortfolioModule} from "../portfolio/portfolio.module";

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    TableModule,
    DialogModule,
    SelectButtonModule,
    MultiSelectModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    CarouselModule,
    CardModule,
    InputTextareaModule,
    ButtonModule,
    SplitterModule,
    InputSwitchModule,
    ConfirmDialogModule,
    FormsModule,
    ToastModule,
    AutoCompleteModule,
    PriceAlertRoutingModule,
    SharedModule,
    PortfolioModule,
  ],
  declarations: [PriceAlertComponent],
  providers: [AppConfigService],
})
export class PriceAlertModule {
}
