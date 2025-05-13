import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  DescriptionChart,
  ProductChart,
  TransactionChart,
  UserChart,
} from "../../models/chart-models";
import { API_ENDPOINTS } from "../../constants/endpoints";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private readonly http = inject(HttpClient);

  //Generic method
  private fetchData<T>(url: string, startDate?: string, endDate?: string) {
    let params = new HttpParams();

    if (startDate) params = params.set("startDate", startDate);
    if (endDate) params = params.set("endDate", endDate);

    return this.http.get<T>(url, { params });
  }

  getUser(startDate?: string, endDate?: string) {
    return this.fetchData<UserChart[]>(
      API_ENDPOINTS.STATISTICS.GET_USER,
      startDate,
      endDate
    );
  }

  getProduct(startDate?: string, endDate?: string) {
    return this.fetchData<ProductChart[]>(
      API_ENDPOINTS.STATISTICS.GET_PRODUCT,
      startDate,
      endDate
    );
  }

  getDescription(startDate?: string, endDate?: string) {
    return this.fetchData<DescriptionChart[]>(
      API_ENDPOINTS.STATISTICS.GET_DESCRIPTION,
      startDate,
      endDate
    );
  }

  getTransaction(startDate?: string, endDate?: string) {
    return this.fetchData<TransactionChart[]>(
      API_ENDPOINTS.STATISTICS.GET_TRANSACTION,
      startDate,
      endDate
    );
  }
}
