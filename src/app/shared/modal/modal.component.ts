import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DateFormatPipe} from "../date.pipe";
import {NumberFormatPipe} from "../number.pipe";

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    providers: [DateFormatPipe, NumberFormatPipe],
})
export class ModalComponent implements OnInit {
    
    public data: any;
    
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
        this.data = this.config.data;
    }

    ngOnInit(): void {

    }

    close(obj: any = null) {
        this.ref.close(obj);
    }

}
