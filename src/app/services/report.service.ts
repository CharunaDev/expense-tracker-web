import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/Report`;

  constructor(private http: HttpClient) {}

  getReport(startDate: Date, endDate: Date, type?: string): Observable<any> {
    let params = new HttpParams()
      .set("startDate", startDate.toISOString())
      .set("endDate", endDate.toISOString());

    if (type) {
      params = params.set("type", type);
    }

    return this.http.get<any>(this.baseUrl, { params });
  }
}
