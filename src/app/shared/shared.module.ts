import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DateFormatPipe} from "./date.pipe";
import {NumberFormatPipe} from "./number.pipe";
import {CurrencyPipe} from "./currency.pipe";
import {DateTimeFormatPipe} from "./datetime.pipe";
import {PeriodFormatPipe} from "./period.pipe";

@NgModule({
  imports:      [
    CommonModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    DateFormatPipe,
    DateTimeFormatPipe,
    NumberFormatPipe,
    CurrencyPipe,
    PeriodFormatPipe,
  ],
  declarations:[
    DateFormatPipe,
    DateTimeFormatPipe,
    NumberFormatPipe,
    CurrencyPipe,
    PeriodFormatPipe,
  ],

})
export class SharedModule { }
