import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
