import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {AppConfig} from "../../../domain/appconfig";
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'monthly-pl',
  templateUrl: './monthly-pl.component.html',
  styleUrls: ['./monthly-pl.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe],
})
export class MonthlyPlComponent implements OnInit {
  @Input() monthlyPlParam: string = '';

  data: any;
  options: any;
  config: AppConfig | undefined;

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private apiService: ApiService) {

    // this.applyDarkTheme();
  }

  ngOnInit(): void {
    this.data = {
      labels: [],
      datasets: []
    };
    this.applyDarkTheme();
  }

  ngOnChanges(event: SimpleChanges) {
    if (!this.isEmpty(this.monthlyPlParam)) {
      this.getMonthPL();
    }
  }

  getMonthPL() {
    this.apiService.get('/daily-asset/monthly-pl/' + this.monthlyPlParam)
        .subscribe({
          next: data => {
            let body = JSON.parse(JSON.stringify(data));
            const result = body.result;
            this.data.labels = result.monthLabel;
            for (let p in result.profitLoss) {
              this.data.datasets.push({
                type: 'bar',
                label: p,
                backgroundColor: this.getColor(),
                data: result.profitLoss[p]
              });
            }
            // this.config = this.configService.config;
            this.applyDarkTheme();
          },
          error: error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
          }
        });
  }

  applyDarkTheme() {
    this.options = {
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
          beginAtZero: false,
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

  private isEmpty(...objArr: any[]) {
    let flag = false;
    objArr.forEach(obj => {
      flag = flag || [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
    });
    return flag;
  }

}
