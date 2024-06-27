import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe],
})
export class ChartComponent implements OnInit {

  @Input() chartURL: string = '';
  initURL: SafeUrl | undefined;
  charts = [];
  urls = [];

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(event: SimpleChanges) {
    let chartURL = event['chartURL'].currentValue;

    // @ts-ignore
    if (chartURL && !this.urls.includes(chartURL)) {
      // @ts-ignore
      let current_url: SafeUrl;
      current_url = this.sanitizer.bypassSecurityTrustResourceUrl(chartURL);
      // @ts-ignore
      this.charts.push(current_url);
      // @ts-ignore
      this.urls.push(chartURL);
    }
  }

  closeChart(index: number) {
    this.charts.splice(index, 1);
    this.urls.splice(index, 1);
  }
}
