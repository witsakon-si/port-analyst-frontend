import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../service/appconfigservice";
import {AppConfig} from "../../domain/appconfig";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {History} from "../../domain/history";
import {ConfirmationService, MessageService} from "primeng/api";
import {NumberFormatPipe} from "../../shared/number.pipe";
import {DateFormatPipe} from "../../shared/date.pipe";
import {environment} from "../../../environments/environment";

import {CalendarOptions} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import {PeriodFormatPipe} from "../../shared/period.pipe";
import {ModalComponent} from "../../shared/modal/modal.component";
import {DialogService} from "primeng/dynamicdialog";
import {ApiService} from "../../service/api.service";

@Component({
  templateUrl: './portfolio.component.html',
  providers: [MessageService, ConfirmationService, NumberFormatPipe, DateFormatPipe, PeriodFormatPipe, DialogService],
})
export class PortfolioComponent implements OnInit {

  chartOptions: any;

  subscription: Subscription | any;

  config: AppConfig | any;

  entities: any;
  selectedEntity: any;

  activeStatuses: any;
  activeStatus: any;

  viewModeOption: any;
  viewMode: any;

  histories: any;
  orgHistories: any;
  realizePLByYear: any;
  realizePLByWeek: any;
  realizePL: any;

  dataCost: any;
  dataUnit: any;

  assetList: any;
  selectedAsset: any;

  arrAsset: any;
  originArrAsset: any;
  arrGroup: any;
  originArrGroup: any;

  historyFilterByViewMode: any;
  historyFilterByActiveStatus: any;
  historyFilterByAsset: any;
  historyFilterByType: any;

  firstLoad: boolean | any;

  history: History | any;
  historyDialog: boolean | any;
  submitted: boolean | undefined;

  dividendDialog: boolean | any;
  activityDialog: boolean | any;

  settingDialog: boolean | any;
  checkedDiffAsset: boolean | any;

  simulatePLDialog: boolean | any;
  simulatePLs: any[];
  stepPrice = [0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2];
  posStepPrice = 0;

  chartDialog: boolean | any;
  monthlyPlParam: string = '';

  side: any[];
  selectedSide: any;

  group: any[] | undefined;

  feeSettings: any = [];

  activeTab: any;
  chartURL: string;

  focusName: string | undefined;
  note: string | undefined;
  lastUpdateNote: string | undefined;

  selectedOrder: boolean = false;
  selectedDividend: boolean = false;
  selectedDividendSt: boolean = false;

  matchOrderMode: boolean = false;
  orderMatch: any = {};

  importDatas: any = [];
  importMode = false;
  collapseSelected = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek',
      center: 'title',
      right: 'prev,next today'
    },
    selectable: true,
    selectMirror: true,
    dayMaxEvents: false,
    showNonCurrentDates: false,
    eventTextColor: '#DFDFDE',
    eventOrder: 'id',
    events: [],
    eventClick: (info) => this.showDetailDialog(info.event.extendedProps['details']),
  };

  constructor(private configService: AppConfigService, private http: HttpClient,
              private dialogService: DialogService,
              private numberFormatPipe: NumberFormatPipe,
              public periodFormatPipe: PeriodFormatPipe,
              private apiService: ApiService,
              private messageService: MessageService, private confirmationService: ConfirmationService,) {
    this.chartURL = '';
    this.side = [
      {name: 'Buy', code: 'B'},
      {name: 'Sell', code: 'S'}
    ];
    this.activeStatuses = [
      {name: 'All', code: 'all'},
      {name: 'Active', code: 'active'},
      {name: 'Inactive', code: 'inactive'},
    ];
    this.viewModeOption = [
      {name: 'Summary', code: 'summary'},
      {name: 'All History', code: 'all'},
    ];
    this.activeStatus = this.activeStatuses[1];
    this.viewMode = this.viewModeOption[0];
    this.simulatePLs = [];
  }

  ngOnInit(): void {
    this.firstLoad = true;
    this.loadAssetHistory();
  }

  userDetailsControls(index: number) {
    // @ts-ignore
    return this.groupDetails.controls[index]["controls"];
  }

  toDate(date: Date) {
    return (date.getDate() + "").padStart(2, "0") + '/' + ((date.getMonth() + 1) + '').padStart(2, "0") + '/' + date.getFullYear();
  }

  toDateTime(date: Date) {
    if (date) {
      return (date.getDate() + "").padStart(2, "0") + '/' + ((date.getMonth() + 1) + '').padStart(2, "0") + '/' + date.getFullYear() +
        ' ' + (date.getHours() + "").padStart(2, "0") + ':' + (date.getMinutes() + "").padStart(2, "0") + ':' + (date.getSeconds() + "").padStart(2, "0");
    } else {
      return '-';
    }
  }

  loadAssetHistory() {
    this.collapseSelected = false;
    this.clearOrderMatch();
    this.apiService.get('/history')
      .subscribe({
        next: data => {
          let body = JSON.parse(JSON.stringify(data));
          this.dataCost = new Map();
          this.dataUnit = new Map();
          this.realizePLByYear = body.realizePLByYearType;
          this.realizePLByWeek = body.realizePLByWeek;
          this.realizePL = body.realizePL;
          this.orgHistories = body.result;
          this.calendarOptions.events = [];
          this.orgHistories.forEach((item: any) => {
            item.list.forEach((history: any) => {
              if (!history.id && history.status == 'active') {
                if (!this.dataCost.get(history.type)) {
                  this.dataCost.set(history.type, new Map());
                }
                this.dataCost.get(history.type).set(history.name, history.cost);

                // available unit
                if (!this.dataUnit.get(history.type)) {
                  this.dataUnit.set(history.type, new Map());
                }
                this.dataUnit.get(history.type).set(history.name, history.unit);
              }
              history.transactionDate = new Date(history.transactionDate);
              history.dividendSt = history.netAmount === 0 && history.unit > 0;
              history.mktPriceDt = history.mktPriceDt ? new Date(history.mktPriceDt) : null;
              if (history.id) {
                if (!history.type.includes('**')) {
                  // @ts-ignore
                  this.calendarOptions.events.push({
                    id: history.id,
                    title: history.name + ' - ' + history.type + '...' + this.numberFormatPipe.transform(history.unitPrice),
                    start: this.toDateAC(history.transactionDate),
                    color: history.side == 'B' ? '#3d4035' : history.dividend ? '#0b285c' : '#8a2f47',
                    extendedProps: {
                      details: history
                    },
                  });
                }
              }
            });
          });

          this.originArrAsset = body.assetList.map(function(a: { name: string; }) {return a.name;});
          this.originArrGroup = body.groupList;
          this.arrAsset = JSON.parse(JSON.stringify(this.originArrAsset));
          this.arrGroup = JSON.parse(JSON.stringify(this.originArrGroup));

          this.assetList = [{name: '--- All ---', code: ''}];
          this.selectedAsset = this.assetList[0];
          this.assetList.push.apply(this.assetList, body.assetList);

          if (this.firstLoad) {

          }

          this.firstLoad = false;
          this.changeViewMode();
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  getChartURL(name: string) {
    this.apiService.get('/getChartURL?asset='+name)
      .subscribe({
        next: data => {
          let body = JSON.parse(JSON.stringify(data));
          this.chartURL = body.message;
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  getFullPrice(history: History) {
    this.apiService.get('/get-stock-price/'+history.name)
      .subscribe({
        next: data => {
          let body = JSON.parse(JSON.stringify(data));
          if (body) {
            const price = body.fullPrice;
            const refPrice = body.refPrice;
            history.fullPrice = '' +
            price.symbol + ' @' + this.toDatetime(new Date(price.lastUpdate)) + '\n' +
            'Last Close: ' + price.lastClose + '\n' +
            'Open: ' + price.open + '\n' +
            'Current: ' + price.current + '\n' +
            'High: ' + price.high + '\n' +
            'Low: ' + price.low + '\n' +
            'Change: ' + price.change + ' (' + price.percentChange + ')' + '\n' +
            '';

            if (refPrice) {
              history.refPrice = refPrice.price;
            }
          }
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  getAvailableUnit(history: History) {
    history.unit = 0;
    if (history.type && history.name) {
      if (this.dataUnit.has(history.type)) {
        if (this.dataUnit.get(history.type).has(history.name)) {
          history.unit = this.dataUnit.get(history.type).get(history.name);
        }
      }
    }
  }


  changeTab(e: any) {
    this.activeTab = e.index;
  }

  openNew() {
    this.collapseSelected = false;
    this.history = {
      transactionDate: new Date(new Date().toDateString()),
      side: 'B',
      feeRate: 0,
      vatRate: 0,
      clearingFeeRate: 0,
      commissionRate: 0,
    };
    this.submitted = false;
    this.historyDialog = true;
  }

  openDividendDialogNew() {
    this.history = {
      transactionDate: new Date(new Date().toDateString()),
      side: 'S',
      amount: 0,
      unit: 0,
      unitPrice: 0,
      fee: 0,
      clearingFee: 0,
      vat: 0,
      commission: 0,
      feeRate: 0,
      vatRate: 0,
      clearingFeeRate: 0,
      commissionRate: 0,
      dividend: true,
      interest: false,
    };
    // this.submitted = false;
    this.dividendDialog = true;
  }

  openSettingDialog() {
    this.settingDialog = true;
  }

  openSimulatePLDialog(extend: boolean) {
    this.simulatePLDialog = true;
    this.simulatePLs = [];
    const round = extend ? 15 : 10;
    const diff0 = {
      unit: this.orderMatch.totalUnit,
      buy: this.orderMatch.price,
      sell: this.orderMatch.price,
      diff: 0,
      sumBuy: 0,
      sumSell: 0,
      commissionBuy: 0,
      commissionSell: 0,
      vatBuy: 0,
      vatSell: 0,
      totalBuy: 0,
      totalSell: 0,
      net: 0,
      percentNet: 0,
    }
    diff0.sumBuy = diff0.buy * diff0.unit;
    diff0.sumSell = diff0.sell * diff0.unit;
    diff0.commissionBuy = diff0.sumBuy * 0.0016;
    diff0.commissionSell = diff0.sumSell * 0.0016;
    diff0.vatBuy = diff0.commissionBuy * 0.07;
    diff0.vatSell = diff0.commissionSell * 0.07;
    diff0.totalBuy = diff0.sumBuy + diff0.commissionBuy + diff0.vatBuy;
    diff0.totalSell = diff0.sumSell - diff0.commissionSell - diff0.vatSell;
    diff0.net = diff0.totalSell - diff0.totalBuy;

    for (let i = -round; i <= round; i++) {
      if (i == 0) {
        this.simulatePLs.push(diff0);
        continue;
      }
      const diffX = JSON.parse(JSON.stringify(diff0));
      diffX.diff += i * this.stepPrice[this.posStepPrice];
      diffX.sell = diffX.buy + diffX.diff;
      diffX.sumBuy = diffX.buy * diffX.unit;
      diffX.sumSell = diffX.sell * diffX.unit;
      diffX.commissionBuy = diffX.sumBuy * 0.0016;
      diffX.commissionSell = diffX.sumSell * 0.0016;
      diffX.vatBuy = diffX.commissionBuy * 0.07;
      diffX.vatSell = diffX.commissionSell * 0.07;
      diffX.totalBuy = diffX.sumBuy + diffX.commissionBuy + diffX.vatBuy;
      diffX.totalSell = diffX.sumSell - diffX.commissionSell - diffX.vatSell;
      diffX.net = diffX.totalSell - diffX.totalBuy;
      diffX.percentNet = (diffX.net / diffX.totalBuy) * 100;
      this.simulatePLs.push(diffX);
    }
  }

  extendSimulatePLDialog() {
    this.openSimulatePLDialog(true);
  }

  upStepPrice() {
    this.posStepPrice += 1;
    this.openSimulatePLDialog(false);
  }

  setFocus(name: string) {
    this.focusName = name;
    this.note = '';
    this.loadNote(name);
  }

  edit(history: History) {
    if (history.dividend) {
      this.editDividend(history);
    } else {
      this.editHistory(history);
    }
  }

  editHistory(history: History) {
    this.history = {...history};
    this.historyDialog = true;
    this.selectedSide = this.history.side === 'B' ? this.side[0] : this.side[1];
  }

  editDividend(history: History) {
    this.history = {...history};
    this.dividendDialog = true;
  }

  showChartDialog(type: string, name: string) {
    this.chartDialog = true;
    this.monthlyPlParam = '?type='+type+'&name='+name;
  }

  showActivityDialog() {
    this.activityDialog = true;
  }

  deleteHistory(history: History) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete('/history/' + history.id)
          .subscribe({
            next: data => {
              this.loadAssetHistory();
              this.history = {};
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

  searchAsset(event: any) {
    this.arrAsset = this.originArrAsset.filter(function (str: string) { return str.toUpperCase().includes(event.query.toUpperCase()); });
  }

  searchGroup(event: any) {
    this.arrGroup = this.originArrGroup.filter(function (str: string) { return str.toUpperCase().includes(event.query.toUpperCase()); });
  }

  syncPrice() {
    this.apiService.get('/syncPrice')
      .subscribe({
        next: data => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Update price complete.',
            life: 3000
          });
          this.loadAssetHistory();
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }


  hideDialog() {
    this.historyDialog = false;
    this.submitted = false;
    this.importMode = false;
    this.importDatas = [];
    this.collapseSelected = false;
  }

  hideDividendDialog() {
    this.dividendDialog = false;
    // this.submitted = false;
  }

  hideSettingDialog() {
    this.settingDialog = false;
  }

  hideSimulatePLDialog() {
    this.simulatePLDialog = false;
    this.simulatePLs = [];
    this.posStepPrice = 0;
  }

  hideChartDialog() {
    this.chartDialog = false;
  }

  hideActivityDialog() {
    this.activityDialog = false;;
  }

  loadNote(name: string) {
    this.apiService.get('/note/' + name)
      .subscribe({
        next: data => {
          let body = JSON.parse(JSON.stringify(data));
          if (body.responseCode === "DATA_NOT_FOUND") {
            this.lastUpdateNote = '';
          } else {
            this.note = body.result.note;
            this.lastUpdateNote = this.toDateTime(new Date(body.result.updatedAt));
          }
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  saveNote() {
    this.apiService.post('/note/' + this.focusName + '?note=' + this.note, null)
      .subscribe({
        next: data => {
          this.hideSettingDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: "Note Saved",
            life: 3000
          });
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
  }

  selectSaveHistory() {
    if (this.importMode) {
      this.saveImport();
    } else {
      this.saveHistory();
    }
  }

  saveHistory() {
    this.submitted = true;
    this.history.orderMatch = this.history.orderMatch ? this.history.orderMatch : '-';
    this.apiService.post('/history', this.history)
      .subscribe({
        next: data => {
          this.hideDialog();
          this.loadAssetHistory();
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

  saveDividend() {
    // this.submitted = true;
    if (this.history.interest) {
      this.history.side = 'B';
      this.history.amount = this.history.netAmount;
      this.history.unit = this.history.netAmount;
      this.history.unitPrice = 1;
    }
    this.history.orderMatch = '-';
    this.apiService.post('/history', this.history)
      .subscribe({
        next: data => {
          this.hideDividendDialog();
          this.loadAssetHistory();
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

  saveImport() {
    this.apiService.post('/history/import', this.importDatas)
      .subscribe({
        next: data => {
          this.hideDialog();
          this.loadAssetHistory();
          this.importDatas = [];
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

  onChangeGroup(history: History) {
    if (history.type?.includes(":")) {
      const arr = history.type.split(':');
      history.type = arr[0];
      history.name = arr[1];
    }
  }
  onChangeName(history: History) {
    if (history.type) {
      this.feeSettings.forEach((setting: any) => {
        if (history.type === setting.groupName) {
          if (setting.feeType === 'ACF') {
            history.feeRate = history.side === 'B' ? setting.feeRateList[0].feeRateBuy : setting.feeRateList[0].feeRateSell;
            history.vatRate = history.side === 'B' ? setting.feeRateList[0].vatRateBuy : setting.feeRateList[0].vatRateSell;
            history.commissionRate = history.side === 'B' ? setting.feeRateList[0].commissionRateBuy : setting.feeRateList[0].commissionRateSell;
          } else if (setting.feeType === 'ASF') {
            setting.feeRateList.forEach((item: any) => {
              if (item.asset === history.name) {
                history.feeRate = history.side === 'B' ? item.feeRateBuy : item.feeRateSell;
                history.vatRate = history.side === 'B' ? item.vatRateBuy : item.vatRateSell;
                history.commissionRate = history.side === 'B' ? item.commissionRateBuy : item.commissionRateSell;
              }
            });
          }
        }
      });
    }
  }
  onChangePrice(history: History, $event: any) {
    history.amount = Number(history.unit) * Number($event.target.value.replace(',',''));
    if (history.type === 'Crypto') {
      history.amount = history.amount.toFixed(7);
    } else {
      history.amount = history.amount.toFixed(2);
    }
    if (!isNaN(history.amount)) {
      history.fee = !isNaN(history.fee) ? history.fee : 0;
      history.vat = !isNaN(history.vat) ? history.vat : 0;
      history.clearingFee = !isNaN(history.clearingFee) ? history.clearingFee : 0;
      history.commission = !isNaN(history.commission) ? history.commission : 0;
      history.netAmount = 0;
      if (history.side === 'B') {
        history.netAmount = history.amount + history.fee + history.clearingFee + history.vat + history.commission;
      } else {
        history.netAmount = history.amount - history.fee - history.clearingFee - history.vat - history.commission;
      }
    }
  }
  onChangeUnit(history: History, $event: any) {
    history.amount = Number($event.target.value.replace(',','')) * Number(history.unitPrice);
    if (history.type === 'Crypto') {
      history.amount = history.amount.toFixed(7);
    } else {
      history.amount = history.amount.toFixed(2);
    }
    if (!isNaN(history.amount)) {
      history.vat = !isNaN(history.vat) ? history.vat : 0;
      history.fee = !isNaN(history.fee) ? history.fee : 0;
      history.clearingFee = !isNaN(history.clearingFee) ? history.clearingFee : 0;
      history.commission = !isNaN(history.commission) ? history.commission : 0;
      history.netAmount = 0;
      if (history.side === 'B') {
        history.netAmount = history.amount + history.fee + history.clearingFee + history.vat + history.commission;
      } else {
        history.netAmount = history.amount - history.fee - history.clearingFee - history.vat - history.commission;
      }
    }
  }
  onChangeFee(history: History, $event: any) {
    history.netAmount = 0;
    if (!isNaN(history.amount)) {
      history.netAmount += history.amount;
      history.netAmount += Number($event.target.value.replace(',','')) * (history.side === 'B' ? 1 : -1);
      if (!isNaN(history.clearingFee)) {
        if (history.side === 'B') {
          history.netAmount += history.clearingFee;
        } else {
          history.netAmount -= history.clearingFee;
        }
      }
      if (!isNaN(history.vat)) {
        if (history.side === 'B') {
          history.netAmount += history.vat;
        } else {
          history.netAmount -= history.vat;
        }
      }
      if (!isNaN(history.commission)) {
        if (history.side === 'B') {
          history.netAmount += history.commission;
        } else {
          history.netAmount -= history.commission;
        }
      }
    }
  }
  onChangeClearingFee(history: History, $event: any) {
    history.netAmount = 0;
    if (!isNaN(history.amount)) {
      history.netAmount += history.amount;
      history.netAmount += Number($event.target.value.replace(',','')) * (history.side === 'B' ? 1 : -1);
      if (!isNaN(history.fee)) {
        if (history.side === 'B') {
          history.netAmount += history.fee;
        } else {
          history.netAmount -= history.fee;
        }
      }
      if (!isNaN(history.vat)) {
        if (history.side === 'B') {
          history.netAmount += history.vat;
        } else {
          history.netAmount -= history.vat;
        }
      }
      if (!isNaN(history.commission)) {
        if (history.side === 'B') {
          history.netAmount += history.commission;
        } else {
          history.netAmount -= history.commission;
        }
      }
    }
  }
  onChangeVat(history: History, $event: any) {
    history.netAmount = 0;
    if (!isNaN(history.amount)) {
      history.netAmount += history.amount;
      history.netAmount += Number($event.target.value.replace(',','')) * (history.side === 'B' ? 1 : -1);
      if (!isNaN(history.fee)) {
        if (history.side === 'B') {
          history.netAmount += history.fee;
        } else {
          history.netAmount -= history.fee;
        }
      }
      if (!isNaN(history.clearingFee)) {
        if (history.side === 'B') {
          history.netAmount += history.clearingFee;
        } else {
          history.netAmount -= history.clearingFee;
        }
      }
      if (!isNaN(history.commission)) {
        if (history.side === 'B') {
          history.netAmount += history.commission;
        } else {
          history.netAmount -= history.commission;
        }
      }
    }
  }
  onChangeCommission(history: History, $event: any) {
    history.netAmount = 0;
    if (!isNaN(history.amount)) {
      history.netAmount += history.amount;
      history.netAmount += Number($event.target.value.replace(',',''))* (history.side === 'B' ? 1 : -1);
      if (!isNaN(history.fee)) {
        if (history.side === 'B') {
          history.netAmount += history.fee;
        } else {
          history.netAmount -= history.fee;
        }
      }
      if (!isNaN(history.clearingFee)) {
        if (history.side === 'B') {
          history.netAmount += history.clearingFee;
        } else {
          history.netAmount -= history.clearingFee;
        }
      }
      if (!isNaN(history.vat)) {
        if (history.side === 'B') {
          history.netAmount += history.vat;
        } else {
          history.netAmount -= history.vat;
        }
      }
    }
  }
  changeViewMode() {
    this.filterByViewMode();
    this.changeActiveStatus();
  }

  changeActiveStatus() {
    this.filterActiveStatus();
    this.changeAsset();
  }

  changeAsset() {
    !this.selectedAsset ? this.selectedAsset = this.assetList[0] : this.selectedAsset;
    this.filterByAsset();
    this.histories = this.historyFilterByAsset;
  }

  changeMatchOrderMode() {

  }

  changeFilterType() {
    if (this.viewMode.code === 'summary') {
      return;
    }
    if (this.selectedOrder && this.selectedDividend && this.selectedDividendSt) {
      this.histories = this.historyFilterByAsset;
    } else {
      this.historyFilterByType = [];
      this.historyFilterByAsset.forEach((item: any) => {
        let newList: any[] = [];
        item.list.forEach((history: any) => {
          if (!history.id) {
            newList.push(history);
          }
          if (this.selectedOrder && (history.id && !history.dividend && !history.dividendSt)) {
            newList.push(history);
          }
          if (this.selectedDividend && history.dividend) {
            newList.push(history);
          }
          if (this.selectedDividendSt && history.dividendSt) {
            newList.push(history);
          }
        });
        this.historyFilterByType.push(
            {type: item.type, accountInfo: item.accountInfo, list: newList}
        );
      });
      this.histories = this.historyFilterByType;
    }
  }

  filterByViewMode() {
    if (this.viewMode.code === 'all') {
      this.historyFilterByViewMode = this.orgHistories;
    } else if (this.viewMode.code === 'summary') {
      this.historyFilterByViewMode = [];
      this.orgHistories.forEach((item: any) => {
        let newList: any[] = [];
        item.list.forEach((history: any) => {
          if (!history.side) {
            newList.push(history);
          }
        });
        this.historyFilterByViewMode.push(
          {type: item.type, accountInfo: item.accountInfo, list: newList}
        );
      });
    }
    this.resetFilterByType();
  }

  filterActiveStatus() {
    let next = false;
    if (this.activeStatus.code === 'all') {
      this.historyFilterByActiveStatus = this.historyFilterByViewMode;
    } else {
      this.historyFilterByActiveStatus = [];
      this.historyFilterByViewMode.forEach((item: any) => {
        let newList: any[] = [];
        item.list.forEach((history: any) => {
          if (history.status) {
            if (history.status === this.activeStatus.code) {
              next = true;
              newList.push(history);
            } else {
              next = false;
            }
          } else {
            if (next) {
              newList.push(history);
            }
          }
        });
        this.historyFilterByActiveStatus.push(
          {type: item.type, accountInfo: item.accountInfo, list: newList}
        );
      });
    }
    this.resetFilterByType();
  }

  filterByAsset() {
    if (this.selectedAsset.code === '') {
      this.historyFilterByAsset = this.historyFilterByActiveStatus;
    } else {
      this.historyFilterByAsset = [];
      this.historyFilterByActiveStatus.forEach((item: any) => {
        let newList: any[] = [];
        item.list.forEach((history: any) => {
          if (history.name === this.selectedAsset.code) {
            newList.push(history);
          }
        });
        this.historyFilterByAsset.push(
          {type: item.type, accountInfo: item.accountInfo, list: newList}
        );
      });
    }
    this.resetFilterByType();
  }

  resetFilterByType() {
    this.selectedOrder = true;
    this.selectedDividend = true;
    this.selectedDividendSt = true;
  }

  linkApi() {
    window.open(environment.apiURL + "/history/");
  }

  toDatetime(d: Date) {
    if (d) {
      return (d.getDate() + "").padStart(2, "0") + '/' + ((d.getMonth() + 1) + '').padStart(2, "0") + '/' + d.getFullYear() + " " +
          (d.getHours() + "").padStart(2, "0") + ':' + ((d.getMinutes()) + '').padStart(2, "0") + ':' + ((d.getSeconds()) + '').padStart(2, "0");
    } else {
      return null;
    }
  }

  toDateAC(date: Date) {
    return date.getFullYear() + '-' + ((date.getMonth() + 1) + '').padStart(2, "0") + '-' + (date.getDate() + "").padStart(2, "0");
  }

  showDetailDialog(history: any) {
    let desc = '';
    desc += '<div class="msg-box">';
    desc += '<span class="msg-box-detail">Price</span>';
    desc += '<span class="msg-box-dot"></span>';
    desc += '<span class="msg-box-detail msg-box-right">' + this.numberFormatPipe.transform(history.unitPrice) + '</span>';
    desc += '</div>';

    desc += '<br/>';
    desc += '<div class="msg-box">';
    desc += '<span class="msg-box-detail">Unit</span>';
    desc += '<span class="msg-box-dot"></span>';
    desc += '<span class="msg-box-detail msg-box-right">' + this.numberFormatPipe.transform(history.unit) + '</span>';
    desc += '</div>';

    desc += '<br/>';
    desc += '<div class="msg-box">';
    desc += '<span class="msg-box-detail">Net Amount</span>';
    desc += '<span class="msg-box-dot"></span>';
    desc += '<span class="msg-box-detail msg-box-right">' + this.numberFormatPipe.transform(history.netAmount) + '</span>';
    desc += '</div>';

    this.dialogService.open(ModalComponent, {
      header: 'Details',
      width: '20%',
      contentStyle: {"max-height": "700px", "overflow": "auto"},
      baseZIndex: 10000,
      data: {
        message: desc
      },
    }).onClose.subscribe((obj: any) => {
      // console.log(obj);
    });
  }

  matchOrder(history: any) {
    if (history.selected) {
      // validate symbol
      if (this.orderMatch.symbol) {
        if (this.orderMatch.symbol !== history.type + "_" + history.name) {
          history.selected = false;
          this.messageService.add({severity: 'error', summary: 'Match Order', detail: 'Error conflict asset', life: 3000});
          return;
        }
      } else {
        this.orderMatch.symbol = history.type + "_" + history.name;
      }

      // add id
      if (this.orderMatch.historyIds) {
        this.orderMatch.historyIds.push(history.id);
      } else {
        Object.assign(this.orderMatch, {historyIds: [history.id]});
      }

      // calculate unit
      if (this.orderMatch.totalUnit) {
        this.orderMatch.totalUnit += history.side == 'B' ? history.unit : (history.side == 'S' ? (history.unit * -1) : 0);
      } else {
        this.orderMatch.totalUnit = history.side == 'B' ? history.unit : (history.side == 'S' ? (history.unit * -1) : 0);
      }

      // calculate net amount
      if (this.orderMatch.netAmount) {
        this.orderMatch.netAmount += history.side == 'S' ? history.netAmount : (history.side == 'B' ? (history.netAmount * -1) : 0);
      } else {
        this.orderMatch.netAmount = history.side == 'S' ? history.netAmount : (history.side == 'B' ? (history.netAmount * -1) : 0);
      }

      // set price (last select) for simulate p/l
      this.orderMatch.price = history.unitPrice;
    } else {
      // remove id
      this.orderMatch.historyIds = this.orderMatch.historyIds.filter((id: any) => id !== history.id);

      // calculate unit
      this.orderMatch.totalUnit -= history.side == 'B' ? history.unit : (history.side == 'S' ? (history.unit * -1) : 0);

      // calculate net amount
      this.orderMatch.netAmount -= history.side == 'S' ? history.netAmount : (history.side == 'B' ? (history.netAmount * -1) : 0);
    }

    // notice
    this.messageService.add({
      severity: 'success',
      summary: 'Match Order ' + history.name,
      detail: this.orderMatch.historyIds.length + " selected, Total Unit " + this.numberFormatPipe.transform8(this.orderMatch.totalUnit) + ", Net Amount " + this.numberFormatPipe.transform2(this.orderMatch.netAmount),
      life: 3000
    });

    if (this.orderMatch.historyIds.length == 0) {
      this.clearOrderMatch();
    }
  }

  saveMatchOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to match selected order?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.post('/history/match-order', this.orderMatch.historyIds)
            .subscribe({
              next: data => {
                this.loadAssetHistory();
                this.history = {};
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Transaction Saved',
                  life: 3000
                });
              },
              error: error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
              }
            });
      }
    });
  }

  unmatchOrder(matchOrderId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to unmatch order?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.get('/history/unmatch-order/' + matchOrderId)
            .subscribe({
              next: data => {
                this.loadAssetHistory();
                this.history = {};
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Transaction Saved',
                  life: 3000
                });
              },
              error: error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
              }
            });
      }
    });
  }

  clearOrderMatch() {
    this.orderMatch = {};
  }

  onUpload(event: any) {
    if (event.files.length === 0) {
      return;
    }
    const file = event.files[0];
      this.apiService.importFile('/history/pdf2json/', file).subscribe({
        next: resp => {
          let data = JSON.parse(JSON.stringify(resp));
          if (data.body) {
            this.importDatas = data.body.data;
            if (this.importDatas.length > 0) {
              this.importDatas.forEach((data: any) => {
                data.amount = data.unit * data.unitPrice;
                data.transactionDate = new Date(new Date().toDateString());
                data.type = data.type.replace('(', ' (');
              });
              this.history = this.importDatas[0];
              this.importMode = true;
              this.collapseSelected = false;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: "Upload Complete",
              life: 3000
            });
          }
        },
        error: error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      });
    }

    onPageChange(event: any) {
      this.history = this.importDatas[event.page];
    }

    openCollapse() {
      this.collapseSelected = true;
    }

    closeCollapse() {
      this.collapseSelected = false;
    }
}
