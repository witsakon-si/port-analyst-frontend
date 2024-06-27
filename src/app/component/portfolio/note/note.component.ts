import {Component, OnInit} from '@angular/core';
import {DateFormatPipe} from "../../../shared/date.pipe";
import {NumberFormatPipe} from "../../../shared/number.pipe";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.css'],
    providers: [DateFormatPipe, NumberFormatPipe],
})
export class NoteComponent implements OnInit {

    public notes = [];

    private apiUrl = environment.apiURL;

    constructor(private messageService: MessageService,
                private http: HttpClient) {
    }

    ngOnInit(): void {

    }

    loadMemo() {
        this.http.get(this.apiUrl + '/note', {observe: 'response'})
            .subscribe({
                next: data => {
                    let body = JSON.parse(JSON.stringify(data)).body;
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
