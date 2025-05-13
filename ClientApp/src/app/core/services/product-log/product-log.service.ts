import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProductLog } from "../../models/product-log.models";
import { PagedResult } from "../../models/page-result.model";
import { Observable } from "rxjs";
import { API_ENDPOINTS } from "../../constants/endpoints";

@Injectable({
  providedIn: "root",
})
export class ProductLogService {
  private readonly http = inject(HttpClient);
  pageSize: number = 10;

  get(id: number, skip: number = 0): Observable<PagedResult<ProductLog>> {
    const params = new HttpParams()
      .set("skip", skip.toString())
      .set("pageSize", this.pageSize.toString());

    return this.http.get<PagedResult<ProductLog>>(
      API_ENDPOINTS.PRODUCT_LOGS(id),
      {
        params,
      }
    );
  }

  add(data: ProductLog): Observable<ProductLog> {
    return this.http.post<ProductLog>(API_ENDPOINTS.PRODUCT_LOGS(), data);

  }
}
