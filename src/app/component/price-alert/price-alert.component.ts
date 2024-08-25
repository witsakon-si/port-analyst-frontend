import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../service/appconfigservice";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ConfirmationService, MessageService} from "primeng/api";
import {NumberFormatPipe} from "../../shared/number.pipe";
import {DateFormatPipe} from "../../shared/date.pipe";
import {PriceAlert} from "../../domain/priceAlert";
import {CurrencyPipe} from "../../shared/currency.pipe";

// @ts-ignore
import * as SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import {AuthService} from "../../auth/auth.service";
import {ApiService} from "../../service/api.service";

@Component({
    selector: 'price-alert',
    templateUrl: './price-alert.component.html',
    styleUrls: ['./price-alert.component.css'],
    providers: [MessageService, ConfirmationService, NumberFormatPipe, DateFormatPipe, CurrencyPipe],
})
export class PriceAlertComponent implements OnInit {
    private apiUrl = environment.apiURL;

    priceAlertData: any;
    priceAlert: any;
    priceAlertDialog: boolean = false;
    submitted: boolean | undefined;

    conditionType: any[];
    noticeFrequency: any[];
    assets: any[];

    arrSymbol: any;
    originArrSymbol: any;

    webSocketEndPoint: string = this.apiUrl + '/ws?token='+this.authService.getToken();
    topic: string = "/topic/realtime-price";
    stompClient: any;
    realtimePriceData: any;

    constructor(private configService: AppConfigService, private http: HttpClient,
                private authService: AuthService,
                private apiService: ApiService,
                private currencyPipe: CurrencyPipe,
                private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.conditionType = [];
        this.noticeFrequency = [];
        this.assets = [];
        this.arrSymbol = [];
        this.realtimePriceData = [];
    }

    ngOnInit(): void {
        this.loadPriceAlert();

        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = () => {};
        const _this = this;
        _this.stompClient.connect({Authorization: `Bearer ${this.authService.getToken()}`}, (frame: any) => {
          _this.stompClient.subscribe(_this.topic, (message: any) => {
                const priceData = JSON.parse(message.body);
                priceData.lastUpdate = new Date(priceData.lastUpdate);
                const index = this.realtimePriceData.findIndex((object: { symbol: any; }) => {
                    return object.symbol === priceData.symbol;
                });
                if (index < 0) {
                    this.realtimePriceData.push(priceData);
                } else {
                    this.realtimePriceData[index] = priceData;
                }
            });
        }, function(error: any) {
        });
    }

    loadPriceAlert() {
        this.apiService.get('/price-alert')
            .subscribe({
                next: data => {
                    let body = JSON.parse(JSON.stringify(data));
                    this.realtimePriceData = body.realtimePrice;
                    this.realtimePriceData.forEach((item: any) => {
                        item.lastUpdate = new Date(item.lastUpdate);
                    });
                    this.conditionType = body.conditionType;
                    this.noticeFrequency = body.noticeFrequency;
                    this.originArrSymbol = body.symbolList.map(function (a: { name: string; }) {
                        return a.name;
                    });
                    this.arrSymbol = JSON.parse(JSON.stringify(this.originArrSymbol));
                    this.assets = [];
                    for (const [key, value] of Object.entries(body.assetInfo)) {
                        this.assets.push(value);
                    }
                    this.priceAlertData = body.result.map((i: any) => {
                        return Object.assign(i, {frequencyDesc: this.noticeFrequency.find(f => f.code === i.frequency).name})
                    });
                },
                error: error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
                }
            });
    }

    openNew() {
        this.priceAlert = {
            symbol: null,
            price: 0,
            condition: 'GE',
            frequency: 'ONETIME',
            note: null,
        };
        this.submitted = false;
        this.priceAlertDialog = true;
    }

    edit(priceAlert: PriceAlert) {
        this.priceAlert = {...priceAlert};
        this.priceAlertDialog = true;
    }

    delete(priceAlert: PriceAlert) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.apiService.delete('/price-alert/' + priceAlert.id)
                    .subscribe({
                        next: data => {
                            this.loadPriceAlert();
                            this.priceAlert = {};
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Transaction Deleted',
                                life: 3000
                            });
                        },
                        error: error => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.message,
                                life: 3000
                            });
                        }
                    });
            }
        });
    }

    save() {
        this.submitted = true;
        const obj = JSON.parse(JSON.stringify(this.priceAlert));
        delete obj.mktPrice;
        this.apiService.post('/price-alert', obj)
            .subscribe({
                next: data => {
                    this.hideDialog();
                    this.loadPriceAlert();
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

    hideDialog() {
        this.priceAlertDialog = false;
        this.submitted = false;
    }

    searchSymbol(event: any) {
        this.arrSymbol = this.originArrSymbol.filter(function (str: string) {
            return str.toUpperCase().includes(event.query.toUpperCase());
        });
    }

    onChangeSymbol(symbol: string) {
        if (symbol) {
            this.apiService.get('/get-forex-price?symbol=' + symbol)
                .subscribe({
                    next: data => {
                        let body = JSON.parse(JSON.stringify(data));
                        this.priceAlert.mktPrice = body.price;
                    },
                    error: error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message,
                            life: 3000
                        });
                    }
                });
        }
    }

    isFocus(symbol: string) {
        return this.originArrSymbol?.includes(symbol);
    }

    getCurrentPrice(data: any) {
      if (data.targetPrices) {
        return this.currencyPipe.transform(data.current.toFixed(2));
      } else {
        return this.currencyPipe.transform(data.current);
      }
    }

}
