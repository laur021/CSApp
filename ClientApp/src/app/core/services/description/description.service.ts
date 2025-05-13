import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Description } from "../../models/description.models";
import { Observable } from "rxjs";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { PagedResult } from "../../models/page-result.model";

@Injectable({
  providedIn: "root",
})
export class DescriptionService {
  private readonly http = inject(HttpClient);
  // pageSize: number = 10; - inalis ko yung default pagesize kasi need ko yung complete list sa entry form ng transaction

  getAll(
    skip: number = 0,
    pageSize?: number,
    productId?: number,
    withLogs?: boolean
  ): Observable<PagedResult<Description>> {
    let params = new HttpParams().set("skip", skip.toString());

    if (pageSize !== undefined) {
      params = params.set("pageSize", pageSize.toString());
    }

    if (productId !== undefined) {
      params = params.set("productId", productId.toString());
    }

    if (withLogs !== undefined) {
      params = params.set("includeLogs", withLogs.toString());
    }

    return this.http.get<PagedResult<Description>>(
      API_ENDPOINTS.DESCRIPTION(),
      { params }
    );
  }

  add(description: Description): Observable<Description> {
    return this.http.post<Description>(
      API_ENDPOINTS.DESCRIPTION(),
      description
    );
  }

  update(
    id: number,
    descriptionToBeUpdate: Description
  ): Observable<Description> {
    return this.http.put<Description>(
      API_ENDPOINTS.DESCRIPTION(id),
      descriptionToBeUpdate
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.DESCRIPTION(id));
  }
}
