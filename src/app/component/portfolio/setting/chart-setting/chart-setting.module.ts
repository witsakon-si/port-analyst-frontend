import {NgModule} from '@angular/core';
import {DateFormatPipe} from "../../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../../shared/number.pipe";

@NgModule({
  imports: [],
  declarations: [DateFormatPipe, NumberFormatPipe],
  providers: [DateFormatPipe, NumberFormatPipe],
  exports: [DateFormatPipe, NumberFormatPipe]
})
export class PortfolioModule {
}
