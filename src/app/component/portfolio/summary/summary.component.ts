import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {AppConfigService} from "../../../service/appconfigservice";
import {AppConfig} from "../../../domain/appconfig";
import {CurrencyPipe} from "../../../shared/currency.pipe";

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe, CurrencyPipe],
})
export class SummaryComponent implements OnInit {

  @Input('histories') histories: any;
  @Input('dataCost') dataCost: any;

  items: any[];
  itemsInactive: any[];
  
  isShowDialog = false;
  dataCharts: any = [];

  public isAccordionOpened: boolean = false;

  data: any;
  chartOptions: any;
  config: AppConfig | undefined;
  color = ['#655D8A', '#FDCEB9', '#da9100', null, '#7A58BF', null, '#ffd700', '#F37021', '#8843F2', '#f542c8'];

  constructor(private numberFormatPipe: NumberFormatPipe, private currencyPipe: CurrencyPipe, private configService: AppConfigService) {
    this.items = [];
    this.itemsInactive = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      if (this.isAccordionOpened) {
        this.loadData();
        this.genPieChart();
      }
    } catch (e) {

    }
  }

  openAccordion() {
    this.isAccordionOpened = true;
    this.loadData();
  }

  applyDarkTheme() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          },
          position: 'right'
        }
      }
    };
  }

  resetChart() {
    this.data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
        },
      ]
    };
  }

  loadData() {
    this.resetChart();
    this.items = [];
    this.itemsInactive = [];
    const summaryItemActive = {
      account: 'Summary',
      accountInfo: {
        balance: 0,
        netBalance: 0,
        profitLoss: 0,
        percentPL: 0,
      }
    }
    const summaryItemInactive = {
      account: 'Summary',
      accountInfo: {
        cost: 0,
        profitLoss: 0,
        percentPL: 0,
      }
    }
    let totalBalance = 0;
    this.histories.forEach((history: { accountInfo: any; type: any; }, index: number) => {
      totalBalance += history.accountInfo.balance;
    });
    this.histories.forEach((history: { accountInfo: any; type: any; }, index: number) => {
      if (history.accountInfo.netBalance) {
        this.items.push({
          accountInfo: history.accountInfo,
          account: history.type,
        });
        this.data.labels.push(history.type + ' - ' + ((history.accountInfo.balance / totalBalance) * 100).toFixed(2) + '%');
        this.data.datasets[0].data.push(history.accountInfo.balance);
        this.data.datasets[0].backgroundColor.push(this.getColor());

        summaryItemActive.accountInfo.balance += history.accountInfo.balance;
        summaryItemActive.accountInfo.netBalance += history.accountInfo.netBalance;
        summaryItemActive.accountInfo.profitLoss += history.accountInfo.profitLoss;
      } else {
        this.itemsInactive.push({
          accountInfo: history.accountInfo,
          account: history.type,
        });
        summaryItemInactive.accountInfo.cost += history.accountInfo.cost;
        summaryItemInactive.accountInfo.profitLoss += history.accountInfo.profitLoss;
      }
    });
    let pl = (summaryItemActive.accountInfo.netBalance - summaryItemActive.accountInfo.balance);
    // @ts-ignore
    summaryItemActive.accountInfo.percentPL = ((pl/summaryItemActive.accountInfo.balance) * 100).toFixed(2);
    // @ts-ignore
    summaryItemActive.accountInfo.profitLoss = summaryItemActive.accountInfo.profitLoss.toFixed(2);
    // @ts-ignore
    summaryItemActive.accountInfo.balance = summaryItemActive.accountInfo.balance.toFixed(2);
    // @ts-ignore
    summaryItemActive.accountInfo.netBalance = summaryItemActive.accountInfo.netBalance.toFixed(2);
    this.items = [...this.items, summaryItemActive];

    pl = (summaryItemInactive.accountInfo.cost + summaryItemInactive.accountInfo.profitLoss) - summaryItemInactive.accountInfo.cost;
    // @ts-ignore
    summaryItemInactive.accountInfo.percentPL = ((pl/summaryItemInactive.accountInfo.cost) * 100).toFixed(2);
    // @ts-ignore
    summaryItemInactive.accountInfo.profitLoss = summaryItemInactive.accountInfo.profitLoss.toFixed(2);
    this.itemsInactive = [...this.itemsInactive, summaryItemInactive];

    this.config = this.configService.config;
    this.applyDarkTheme();
  }
  
  showDialog() {
    this.isShowDialog = true;
    this.genPieChart();
  }
  
  genPieChart() {
    this.dataCharts = [];

    for (let [k, map] of this.dataCost) {
      if (map) {
        const tmp = {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
              hoverBackgroundColor: []
            },
          ]
        };
        
        let totalValue = 0;
        for (let [key, value] of map) {
          totalValue += value;
        }
        if (!totalValue) {
          continue
        }
        // sort by value
        map[Symbol.iterator] = function* () {
          yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
        }
        for (let [key, value] of map) {
          // @ts-ignore
          tmp.labels.push(key + ' (' + ((value / totalValue) * 100).toFixed(2) + '%)');
          // @ts-ignore
          tmp.datasets[0].data.push(value);
          // @ts-ignore
          tmp.datasets[0].backgroundColor.push(this.getColor());
        }
        this.dataCharts.push({
          name: k,
          data: tmp
        });
      }
    }
  }

  hideDialog() {
    this.isShowDialog = false;
  }

  getColor() {
    return "hsl(" + 360 * Math.random() + ',' +
      (25 + 70 * Math.random()) + '%,' +
      (55 + 10 * Math.random()) + '%)'
  }
}
