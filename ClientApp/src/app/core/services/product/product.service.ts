import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../models/product.models";
import { Observable } from "rxjs";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { PagedResult } from "../../models/page-result.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  // pageSize: number = 10; - inalis ko yung default pagesize kasi need ko yung complete list sa entry form ng transaction

  getAll(
    skip: number = 0,
    pageSize?: number,
    withDesc?: boolean,
    withLogs?: boolean
  ): Observable<PagedResult<Product>> {
    let params = new HttpParams().set("skip", skip.toString());

    if (pageSize !== undefined) {
      params = params.set("pageSize", pageSize.toString());
    }

    if (withDesc !== undefined) {
      params = params.set("includeDescriptions", withDesc.toString());
    }

    if (withLogs !== undefined) {
      params = params.set("includeLogs", withLogs.toString());
    }

    return this.http.get<PagedResult<Product>>(API_ENDPOINTS.PRODUCT(), {
      params,
    });
  }

  add(product: Product): Observable<Product> {
    return this.http.post<Product>(API_ENDPOINTS.PRODUCT(), product);
  }

  update(id: number, productToBeUpdate: Product): Observable<Product> {
    return this.http.put<Product>(API_ENDPOINTS.PRODUCT(id), productToBeUpdate);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.PRODUCT(id));
  }
}
