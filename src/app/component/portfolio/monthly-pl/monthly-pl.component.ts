import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {environment} from "../../../../environments/environment";
import {AppConfig} from "../../../domain/appconfig";
import {AppConfigService} from "../../../service/appconfigservice";

@Component({
  selector: 'monthly-pl',
  templateUrl: './monthly-pl.component.html',
  styleUrls: ['./monthly-pl.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe],
})
export class MonthlyPlComponent implements OnInit {
  private apiUrl = environment.apiURL;
  @Input() monthlyPlParam: string = '';
  
  data: any;
  options: any;
  config: AppConfig | undefined;

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private configService: AppConfigService) {

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
    this.http.get(this.apiUrl + '/daily-asset/monthly-pl/' + this.monthlyPlParam, {observe: 'response'})
        .subscribe({
          next: data => {
            let body = JSON.parse(JSON.stringify(data)).body;
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
