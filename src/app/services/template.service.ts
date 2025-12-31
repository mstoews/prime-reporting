import {
    IJournalDetailTemplate,
    IJournalTemplate,
    ITemplateParams,
} from "app/models/journals";
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;
    public currentRowData: IJournalDetailTemplate;

    create(template: IJournalTemplate) {
        var url = this.baseUrl + '/v1/create_template';
        return this.httpClient.post<IJournalTemplate>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    read() {
        var url = this.baseUrl + '/v1/read_journal_template';
        return this.httpClient.get<IJournalTemplate[]>(url);
    }


    delete(template_ref: string) {
        const del = {
            template_ref: template_ref,
        }
        var url = this.baseUrl + '/v1/delete_template';
        return this.httpClient.post<IJournalTemplate>(url, del).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    update(template: IJournalTemplate) {
        var url = this.baseUrl + '/v1/update_template';
        return this.httpClient.post<IJournalTemplate[]>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    createDetails(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/create_template_detail';
        return this.httpClient.post<IJournalDetailTemplate[]>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    readTemplateDetails(template: number) {
        var url = this.baseUrl + '/v1/read_template_details/' + template.toString();
        return this.httpClient.get<IJournalDetailTemplate[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    updateDetails(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/update_template_detail';
        return this.httpClient.post<IJournalDetailTemplate[]>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    createTemplateById(journalTemplate: ITemplateParams) {
        let url = this.baseUrl + '/v1/create_template';
        return this.httpClient.post<IJournalTemplate>(url, journalTemplate).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    deleteDetail(template_id: string) {
        const update = {
            template_id: template_id,
            detail_id: template_id
        }
        var url = this.baseUrl + '/v1/delete_detail_template';
        return this.httpClient.post<IJournalDetailTemplate>(url, update).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

}
