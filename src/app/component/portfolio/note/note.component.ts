import {Component, OnInit} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../service/api.service";

@Component({
    selector: 'note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.css'],
    providers: [DateFormatPipe, NumberFormatPipe],
})
export class NoteComponent implements OnInit {

    public notes = [];

    constructor(private messageService: MessageService,
                private apiService: ApiService,
                private http: HttpClient) {
    }

    ngOnInit(): void {

    }

    loadMemo() {
        this.apiService.get('/note')
            .subscribe({
                next: data => {
                    let body = JSON.parse(JSON.stringify(data));
                    this.notes = body.notes;
                    this.notes.forEach((item: any) => {
                        item.updatedAt = new Date(item.updatedAt);
                    });
                },
                error: error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
                }
            });
    }
}
