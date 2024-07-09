import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {AppConfigService} from "../../../service/appconfigservice";
import {CurrencyPipe} from "../../../shared/currency.pipe";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import {DialogService} from 'primeng/dynamicdialog';
import {ModalComponent} from "../../../shared/modal/modal.component";
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css'],
  providers: [DateFormatPipe, NumberFormatPipe, CurrencyPipe, DialogService],
})
export class PerformanceComponent implements OnInit {

  @Input('realizePLByYear') realizePLByYear: any;
  @Input('realizePLByWeek') realizePLByWeek: any;
  @Input('realizePL') realizePL: any;

  public items = [];
  public cashInOutByYears = [];

  private isAccordionOpened: boolean = false;

  public pLDialog: boolean | any;
  public pLStockDialog: boolean | any;
  public desc = '';

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridYear',
        plugins: [dayGridPlugin],
        headerToolbar: {
            left: 'dayGridYear',
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


  constructor(private numberFormatPipe: NumberFormatPipe, private currencyPipe: CurrencyPipe, private configService: AppConfigService,
              private messageService: MessageService,
              private apiService: ApiService,
              private dialogService: DialogService,
              private http: HttpClient) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
      if (this.isAccordionOpened) {
          this.setData();
      }
  }

  setData() {
    this.items = this.realizePLByYear;
  }

  openAccordion() {
      this.isAccordionOpened = true;
      this.setData();
  }

  loadCashInOutByYear() {
    this.openAccordion();
    this.apiService.get('/account/cash-in-out-by-year')
        .subscribe({
          next: data => {
            let body = JSON.parse(JSON.stringify(data));
            this.cashInOutByYears = body;
          },
          error: error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
          }
        });
  }

  generateEvent() {
      this.calendarOptions.events = [];
      console.log(this.realizePLByWeek);
      this.realizePLByWeek.forEach((item: any) => {
          // @ts-ignore
          this.calendarOptions.events.push({
              title: item.realizePL.toLocaleString(),
              start: this.toDateAC(new Date(item.startDate)),
              end: this.toDateAC(new Date(item.endDate)),
              color: '#0b285c',
              extendedProps: {
                  details: item.details
              },
          });
      });
  }

  showPLDialog() {
      this.pLDialog = true;
      this.generateEvent();
  }

  hidePLDialog() {
    this.pLDialog = false;
  }

  showPLStockDialog() {
      this.pLStockDialog = true;
  }

  hidePLStockDialog() {
    this.pLStockDialog = false;
  }

  showDetailDialog(details: any) {
      this.desc = '';
      details.forEach((item: any) => {
         this.desc += item.periodHold + ' => ' + item.name + ' - ' + item.type + '  ===> ' + item.realizePL.toLocaleString();
         this.desc += '<br/>'
      });
      this.dialogService.open(ModalComponent, {
          header: 'Details',
          width: '40%',
          contentStyle: {"max-height": "700px", "overflow": "auto"},
          baseZIndex: 10000,
          data: {
              message: this.desc
          },
      }).onClose.subscribe((obj: any) => {
          // console.log(obj);
      });
  }

  toDateAC(date: Date) {
    return date.getFullYear() + '-' + ((date.getMonth() + 1) + '').padStart(2, "0") + '-' + (date.getDate() + "").padStart(2, "0");
  }

}
