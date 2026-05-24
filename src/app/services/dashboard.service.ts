import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  DashboardData,
  Transaction,
  ChartData,
  MonthlyData,
} from "../models/dashboard.model";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.baseUrl);
  }

  getDashboardSummary(): Observable<{
    totalExpenses: number;
    totalIncomes: number;
    currentBalance: number;
    currentMonthExpenses: number;
  }> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }

  getRecentTransactions(count: number = 5): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/recent-transactions?count=${count}`,
    );
  }

  getExpenseByCategory(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.baseUrl}/expense-by-category`);
  }

  getMonthlyTrend(months: number = 6): Observable<MonthlyData[]> {
    return this.http.get<MonthlyData[]>(
      `${this.baseUrl}/monthly-trend?months=${months}`,
    );
  }
}
