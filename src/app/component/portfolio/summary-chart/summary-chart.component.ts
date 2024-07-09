import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {AppConfig} from "../../../domain/appconfig";
import {AppConfigService} from "../../../service/appconfigservice";
import {UIChart} from "primeng/chart";
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe],
})
export class SummaryChartComponent implements OnInit {

  @Input('isAccordionOpened') isAccordionOpened: any;
  @Input('dataCashInOut') dataCashInOut: any;

  data: any;
  chartOptions: any;
  config: AppConfig | undefined;

  @ViewChild('chart') chart: UIChart | undefined;

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private apiService: ApiService,
              private configService: AppConfigService) {
  }

  ngOnInit(): void {
    this.data = {
      labels: [],
      datasets: []
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };

  }

  ngOnChanges(event: SimpleChanges) {
    if (this.isAccordionOpened) {
      this.loadData();
    } else if (this.dataCashInOut) {
      this.data = this.dataCashInOut;
    }
  }

  loadData() {
    this.apiService.get('/daily-sum')
        .subscribe({
          next: data => {
            let body = JSON.parse(JSON.stringify(data));
            const result = body.result;
            this.data.labels = result.dateLabel;
            for (let p in result.profitLoss) {
              this.data.datasets.push({
                type: 'line',
                label: p,
                borderColor: this.getColor(),
                borderWidth: 1,
                fill: true,
                data: result.profitLoss[p]
              });
            }
            this.config = this.configService.config;
            this.applyDarkTheme();
          },
          error: error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
          }
        });
  }

  applyDarkTheme() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: '#404040'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: '#404040'
          }
        }
      }
    };
  }

  getColor() {
    return "hsl(" + 360 * Math.random() + ',' +
      (25 + 70 * Math.random()) + '%,' +
      (55 + 10 * Math.random()) + '%)'
  }

}
