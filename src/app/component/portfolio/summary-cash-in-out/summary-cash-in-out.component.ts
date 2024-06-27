import {Component, Input, OnInit} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {AppConfigService} from "../../../service/appconfigservice";
import {CurrencyPipe} from "../../../shared/currency.pipe";

@Component({
  selector: 'summary-cash-in-out',
  templateUrl: './summary-cash-in-out.component.html',
  styleUrls: ['./summary-cash-in-out.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe, CurrencyPipe],
})
export class SummaryCashInOutComponent implements OnInit {

  @Input('cashInOutByYears') cashInOutByYears: any;

  constructor(private numberFormatPipe: NumberFormatPipe, private currencyPipe: CurrencyPipe, private configService: AppConfigService) {
  }

  ngOnInit(): void {
    
  }

}
