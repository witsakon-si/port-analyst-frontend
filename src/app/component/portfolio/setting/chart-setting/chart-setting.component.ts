import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../../shared/number.pipe";
import {AppConfigService} from "../../../../service/appconfigservice";
import {CurrencyPipe} from "../../../../shared/currency.pipe";
import {UntypedFormBuilder} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'chart-setting',
    templateUrl: './chart-setting.component.html',
    styleUrls: ['./chart-setting.component.css'],
    providers: [MessageService, DateFormatPipe, NumberFormatPipe, CurrencyPipe],
})
export class ChartSettingComponent implements OnInit {
    private apiUrl = environment.apiURL;

    @Input('originArrAsset') originArrAsset: any;
    arrAsset: any;
    assetInfos: any;
    assetInfo: any;
    showDialog: boolean = false;
    isEdit: boolean = false;

    constructor(private numberFormatPipe: NumberFormatPipe, private currencyPipe: CurrencyPipe, private configService: AppConfigService,
                private formBuilder: UntypedFormBuilder,
                private http: HttpClient,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    loadSetting() {
        this.http.get(this.apiUrl + '/assetInfo', {observe: 'response'})
            .subscribe({
                next: data => {
                    let body = JSON.parse(JSON.stringify(data)).body;
                    this.assetInfos = body.result;
                },
                error: error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
                }
            });
    }

    save() {
        this.assetInfo['isEdit'] = this.isEdit;
        this.assetInfo['refName'] = this.assetInfo['refName'] && this.assetInfo['refName'].trim() ? this.assetInfo['refName'] : null;
        this.assetInfo['url'] = this.assetInfo['url'] && this.assetInfo['url'].trim() ? this.assetInfo['url'] : null;
        this.assetInfo['refURL'] = this.assetInfo['refURL'] && this.assetInfo['refURL'].trim() ? this.assetInfo['refURL'] : null;
        this.http.post(this.apiUrl + '/assetInfo', this.assetInfo)
            .subscribe({
                next: data => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: "Setting Saved",
                        life: 3000
                    });
                    this.loadSetting();
                    this.hideDialog();
                },
                error: error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message, life: 3000});
                }
            });
    }

    shortUrl(url: string) {
        if (url) {
            return url.split('&')[0] + '...';
        }
        return url;
    }

    searchAsset(event: any) {
        this.arrAsset = this.originArrAsset.filter(function (str: string) {
            return str.toUpperCase().includes(event.query.toUpperCase());
        });
    }

    openNew() {
        this.assetInfo = {
            name: null,
            url: null,
            refName: null,
            refURL: null,
        };
        this.showDialog = true;
        this.isEdit = false;
    }

    edit(data: any) {
        this.assetInfo = JSON.parse(JSON.stringify(data));
        this.showDialog = true;
        this.isEdit = true;
    }

    delete(data: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.http.delete(this.apiUrl + '/assetInfo/' + data.name)
                    .subscribe({
                        next: data => {
                            this.loadSetting();
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
    }
}
