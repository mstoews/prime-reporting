import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { IARTransaction } from 'app/models/ar';
import { ICurrentPeriodParam } from 'app/models/period';
import { debounceTime, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ARService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  readARTransaction() {
    var url = this.baseUrl + '/v1/read_ar_transactions';
    return this.httpClient.get<IARTransaction[]>(url).pipe(debounceTime(200)).pipe(shareReplay());
  }
  deleteARTransaction(params: IARTransaction) {
    var url = this.baseUrl + '/v1/delete_ar_transaction';
    return this.httpClient.post<IARTransaction[]>(url, params).pipe(shareReplay());
  }
  updateARTransaction(params: IARTransaction) {
    var url = this.baseUrl + '/v1/update_ar_transaction';
    return this.httpClient.post<IARTransaction[]>(url, params).pipe(shareReplay());
  }
  readARTransactionByPeriod(params: ICurrentPeriodParam) {
    var url = this.baseUrl + '/v1/read_ar_transaction_by_current_period';
    return this.httpClient.post<IARTransaction[]>(url, params).pipe(shareReplay());
  }
  createARTransaction(params: IARTransaction) {
    var url = this.baseUrl + '/v1/create_ar_transaction';
    return this.httpClient.post<IARTransaction[]>(url, params).pipe(shareReplay());
  }

  closeARTransaction(params: IARTransaction) {
    var url = this.baseUrl + '/v1/close_ar_transaction';
    return this.httpClient.post<IARTransaction[]>(url, params).pipe(shareReplay());
  }

}

