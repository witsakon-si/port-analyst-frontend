import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PortfolioComponent} from "./portfolio.component";
import {PortfolioRoutingModule} from "./portfolio-routing.module";

import {ChartModule} from 'primeng/chart';
import {CarouselModule} from "primeng/carousel";

import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';

import {AppConfigService} from "../../service/appconfigservice";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from "primeng/dialog";
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {CalendarModule} from "primeng/calendar";
import {AccordionModule} from "primeng/accordion";
import {FieldsetModule} from "primeng/fieldset";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CardModule} from 'primeng/card';
import {CashInOutComponent} from "./cash-in-out/cash-in-out.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TooltipModule} from "primeng/tooltip";
import {SummaryComponent} from "./summary/summary.component";
import {ChartComponent} from "./chart/chart.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SummaryChartComponent} from "./summary-chart/summary-chart.component";
import {SharedModule} from "../../shared/shared.module";
import {MonthlyPlComponent} from "./monthly-pl/monthly-pl.component";
import {PerformanceComponent} from "./performance/performance.component";
import {SummaryCashInOutComponent} from "./summary-cash-in-out/summary-cash-in-out.component";
import {NoteComponent} from "./note/note.component";
import {ChartSettingComponent} from "./setting/chart-setting/chart-setting.component";
import {FullCalendarModule} from '@fullcalendar/angular';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    imports: [
        CommonModule,
        ChartModule,
        CarouselModule,
        PortfolioRoutingModule,
        TableModule,
        CheckboxModule,
        RippleModule,
        ButtonModule,
        FormsModule,
        TabViewModule,
        SelectButtonModule,
        MultiSelectModule,
        DropdownModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        AccordionModule,
        FieldsetModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        CardModule,
        InputTextareaModule,
        TooltipModule,
        NgApexchartsModule,
        OverlayPanelModule,
        SharedModule,
        FullCalendarModule,
        FileUploadModule,
        PaginatorModule,
    ],
    declarations: [
        PortfolioComponent,
        CashInOutComponent,
        SummaryComponent,
        PerformanceComponent,
        ChartComponent,
        SummaryChartComponent,
        SummaryCashInOutComponent,
        MonthlyPlComponent,
        NoteComponent,
        ChartSettingComponent
    ],
  providers: [AppConfigService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    exports: [
        SummaryChartComponent
    ]
})
export class PortfolioModule {
}
