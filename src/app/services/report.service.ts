import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  ReportData,
  ExpenseSummary,
  IncomeSummary,
  MonthlyComparison,
} from "../models/report.model";
import { ChartData } from "../models/dashboard.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  generateReport(
    startDate: Date,
    endDate: Date,
    type?: string,
  ): Observable<ReportData> {
    let params = new URLSearchParams();
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    if (type) params.append("type", type);
    return this.http.get<ReportData>(`${this.baseUrl}?${params.toString()}`);
  }

  getExpenseSummary(
    startDate: Date,
    endDate: Date,
  ): Observable<ExpenseSummary> {
    let params = new URLSearchParams();
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    return this.http.get<ExpenseSummary>(
      `${this.baseUrl}/expense-summary?${params.toString()}`,
    );
  }

  getIncomeSummary(startDate: Date, endDate: Date): Observable<IncomeSummary> {
    let params = new URLSearchParams();
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    return this.http.get<IncomeSummary>(
      `${this.baseUrl}/income-summary?${params.toString()}`,
    );
  }

  getCategoryBreakdown(
    startDate: Date,
    endDate: Date,
    type: string = "expense",
  ): Observable<ChartData[]> {
    let params = new URLSearchParams();
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    params.append("type", type);
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/category-breakdown?${params.toString()}`,
    );
  }

  getMonthlyComparison(year: number): Observable<MonthlyComparison[]> {
    return this.http.get<MonthlyComparison[]>(
      `${this.baseUrl}/monthly-comparison?year=${year}`,
    );
  }

  exportReport(
    startDate: Date,
    endDate: Date,
    format: string = "json",
  ): Observable<Blob> {
    let params = new URLSearchParams();
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    params.append("format", format);
    return this.http.get(`${this.baseUrl}/export?${params.toString()}`, {
      responseType: "blob",
    });
  }
}
