import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResult } from "../../models/page-result.model";
import { TransactionLog } from "../../models/transaction-log.model";
import { API_ENDPOINTS } from "../../constants/endpoints";

@Injectable({
  providedIn: "root",
})
export class TransactionLogService {
  private readonly http = inject(HttpClient);
  pageSize: number = 10;

  get(id: string, skip: number = 0): Observable<PagedResult<TransactionLog>> {
    const params = new HttpParams()
      .set("skip", skip.toString())
      .set("pageSize", this.pageSize.toString());

    return this.http.get<PagedResult<TransactionLog>>(
      API_ENDPOINTS.TRANSACTION_LOGS(id),
      {
        params,
      }
    );
  }

  add(data: TransactionLog): Observable<TransactionLog> {
    return this.http.post<TransactionLog>(
      API_ENDPOINTS.TRANSACTION_LOGS(),
      data
    );
  }
}
