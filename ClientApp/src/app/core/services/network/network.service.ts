import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { IPAddress } from "../../models/helper.models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NetworkService {
  private readonly http = inject(HttpClient);

  getIP(): Observable<IPAddress> {
    return this.http.get<IPAddress>(API_ENDPOINTS.HELPERS.GET);
  }
}
