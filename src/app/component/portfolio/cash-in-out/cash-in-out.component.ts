import {Component, Input, OnInit} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {ModalComponent} from "../../../shared/modal/modal.component";
import {DialogService} from "primeng/dynamicdialog";
import {CurrencyPipe} from "../../../shared/currency.pipe";
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'cash-in-out',
  templateUrl: './cash-in-out.component.html',
  styleUrls: ['./cash-in-out.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe, CurrencyPipe],
})
export class CashInOutComponent implements OnInit {

  @Input('account') account: string | undefined;
  @Input('accountInfo') accountInfo: any | undefined;

  public cashInOut: any;
  public cashInOutList = [];

  public showDialog: boolean | undefined;
  public showChartDialog: boolean | undefined;
  public submitted = false;

  public chartData = {};

  cashType: any[];
  selectedCashType: any;

  constructor(private confirmationService: ConfirmationService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private apiService: ApiService,
              private numberFormatPipe: NumberFormatPipe,
              private currencyPipe: CurrencyPipe,
              private dateFormatPipe: DateFormatPipe,
              private http: HttpClient) {
    this.cashType = [
      {name: 'Deposit', code: 'DEPOSIT'},
      {name: 'Withdraw', code: 'WITHDRAW'},
    ];
  }

  ngOnInit(): void {

  }

  loadCashInOutHistory() {
    this.apiService.get('/account/cash-in-out/' + this.account)
      .subscribe({
        next: data => {
          let body = JSON.parse(JSON.stringify(data));
          this.cashInOutList = body;
          this.cashInOutList.forEach((item: any) => {
            item.transactionDate = new Date(item.transactionDate)
          });
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  getHeader(accountInfo: any) {
    if (!accountInfo) {
      return null;
    }
    const cost = this.numberFormatPipe.transform(accountInfo.cost);
    const profitLoss = this.numberFormatPipe.transform(accountInfo.profitLoss);
    const percentPL = this.numberFormatPipe.transform(accountInfo.percentPL);

    if (accountInfo.netBalance) {
      const balance = this.numberFormatPipe.transform(accountInfo.balance);
      const netBalance = this.numberFormatPipe.transform(accountInfo.netBalance);
      return 'Cost: ' + cost + ', Cost Balance: ' + balance + ', Account Balance: ' + netBalance + ', Profit Loss: ' + profitLoss + ', %P/L: ' + percentPL + '%';
    }

    return 'Cost: ' + cost + ', Profit Loss: ' + profitLoss + ', %P/L: ' + percentPL + '%';
  }

  openNew() {
    this.cashInOut = {
      transactionDate: new Date(new Date().toDateString()),
      account: this.account,
      cashType: 'DEPOSIT',
      amount: 0,
      dividend: false,
    };
    this.submitted = false;
    this.showDialog = true;
  }

  edit(cashInOut: any) {
    this.cashInOut = {...cashInOut};
    this.showDialog = true;
    switch (this.cashInOut.side) {
      case 'DEPOSIT':
        this.selectedCashType = this.selectedCashType[0];
        break;
      case 'WITHDRAW':
        this.selectedCashType = this.selectedCashType[1];
        break;
      default:
        this.selectedCashType = null;
    }
  }

  save() {
    this.submitted = true;
    this.apiService.post('/account/cash-in-out', this.cashInOut)
      .subscribe({
        next: data => {
          this.hideDialog();
          this.loadCashInOutHistory();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: "Transaction Saved",
            life: 3000
          });
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  delete(cashInOut: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete('/account/cash-in-out/' + cashInOut.id)
          .subscribe({
            next: data => {
              this.loadCashInOutHistory();
              this.cashInOut = {};
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Transaction Deleted',
                life: 3000
              });
            },
            error: error => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
            }
          });
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  showChart() {
    this.chartData = {
      "labels": [],
      "datasets": [
        {
          "type": "line",
          "label": null,
          "borderColor": "hsl(36.26448639463777,78.90217928944587%,60.63752567735761%)",
          "borderWidth": 1,
          "fill": true,
          "data": []
        }
      ]
    }
    let sumAmount = 0;
    this.cashInOutList.forEach((item: any) => {
      const d = this.dateFormatPipe.transform(item.transactionDate);
      // @ts-ignore
      this.chartData.labels.push(d);
      sumAmount = item.cashType == 'DEPOSIT' ? sumAmount + item.amount : sumAmount - item.amount;
      // @ts-ignore
      this.chartData.datasets[0].data.push(sumAmount);
      // @ts-ignore
      this.chartData.datasets[0].label = item.account;
    });
    this.showChartDialog = true;
  }

  hideChartDialog() {
    this.showChartDialog = false;
  }

  showAccountInfoDialog(accountInfo: any) {
    let desc = '';
    let arr = [
      '<p class="box-side"><span class="box-side-left"> Net.Cost</span>'          + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.balance.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Net.Balance</span>'       + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netBalance.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> U.P/L</span>'             + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.profitLoss.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> %U.P/L</span>'            + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.percentPL.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Cost</span>'              + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.cashBalance.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Acct.Cash</span>'         + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netCashBalance.toFixed(2)) + '</span></p',
      '<p class="box-side-hidden"><span class="box-side-left"></span>'                   + '<span class="box-side-right">' + '' + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Net Commission</span>'    + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netCommission.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Net Fee</span>'           + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netFee.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Net Vat</span>'           + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netVat.toFixed(2)) + '</span></p',
      '<p class="box-side"><span class="box-side-left"> Net Clearing Fee</span>'  + '<span class="box-side-right">' + this.currencyPipe.transform(accountInfo.netClearingFee.toFixed(2)) + '</span></p',
    ]
    arr.forEach(str => {
      desc += str;
      desc += '<br/>'
    });
    desc += '</div>'

    this.dialogService.open(ModalComponent, {
      header: 'Details',
      width: '20%',
      draggable: true,
      contentStyle: {"max-height": "700px", "overflow": "auto"},
      baseZIndex: 10000,
      data: {
        message: desc
      },
    }).onClose.subscribe((obj: any) => {
      // console.log(obj);
    });
  }
}
