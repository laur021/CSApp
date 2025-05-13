import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProductLog } from "../../models/product-log.models";
import { PagedResult } from "../../models/page-result.model";
import { Observable } from "rxjs";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { DescriptionLog } from "../../models/description-log.model";

@Injectable({
  providedIn: "root",
})
export class DescriptionLogService {
  private readonly http = inject(HttpClient);
  pageSize: number = 10;

  get(id: number, skip: number = 0): Observable<PagedResult<DescriptionLog>> {
    const params = new HttpParams()
      .set("skip", skip.toString())
      .set("pageSize", this.pageSize.toString());

    return this.http.get<PagedResult<DescriptionLog>>(
      API_ENDPOINTS.DESCRIPTION_LOGS(id),
      {
        params,
      }
    );
  }

  add(data: DescriptionLog): Observable<DescriptionLog> {
    return this.http.post<DescriptionLog>(
      API_ENDPOINTS.DESCRIPTION_LOGS(),
      data
    );
  }
}
