import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { catchError, debounceTime, distinctUntilChanged, shareReplay, throwError } from 'rxjs';
import { IArtifacts } from 'app/models/journals';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  httpClient = inject(HttpClient)
  toastr = inject(ToastrService);
  private baseUrl = environment.baseUrl;

  create(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/create_evidence';
    return this.httpClient.post<IArtifacts>(url, evidence).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  update(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/update_evidence';
    return this.httpClient.post<IArtifacts>(url, evidence).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  read() {
    var url = this.baseUrl + '/v1/read_evidence';
    return this.httpClient.get<IArtifacts[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readById(journal_id: number) {
    var url = this.baseUrl + '/v1/read_evidence_by_journal/' + journal_id;

    return this.httpClient.get<IArtifacts[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    // This endpoint retrieves all evidence associated with a specific journal ID.
    // Example usage: GET http://localhost:8080/v1/read_evidence_by_journal/19
  }

  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
  }

}
