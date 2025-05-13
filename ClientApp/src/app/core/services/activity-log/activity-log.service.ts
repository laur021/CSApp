import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { Activitylog } from "../../models/activity-log.models";
import { Observable, switchMap } from "rxjs";
import { PagedResult } from "../../models/page-result.model";
import { NetworkService } from "../network/network.service";

@Injectable({
  providedIn: "root",
})
export class ActivityLogService {
  private readonly http = inject(HttpClient);
  pageSize: number = 10;
  networkService = inject(NetworkService);

  getAll(skip: number = 0): Observable<PagedResult<Activitylog>> {
    const params = new HttpParams()
      .set("skip", skip.toString())
      .set("pageSize", this.pageSize.toString());

    return this.http.get<PagedResult<Activitylog>>(API_ENDPOINTS.ACTIVITY_LOG, {
      params,
    });
  }

  add(data: Activitylog): Observable<Activitylog> {
    return this.networkService.getIP().pipe(
      switchMap((res) => {
        data.ipAddress = res.ip; // Ensure IP is set before making the request
        return this.http.post<Activitylog>(API_ENDPOINTS.ACTIVITY_LOG, data);
      })
    );
  }
}
