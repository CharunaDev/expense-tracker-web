import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  Income,
  CreateIncomeDto,
  UpdateIncomeDto,
  IncomeFilters,
} from "../models/income.model";

@Injectable({
  providedIn: "root",
})
export class IncomeService {
  private baseUrl = `${environment.apiUrl}/incomes`;

  constructor(private http: HttpClient) {}

  getIncomes(filters?: IncomeFilters): Observable<Income[]> {
    let params = new URLSearchParams();
    if (filters) {
      if (filters.startDate)
        params.append("startDate", filters.startDate.toISOString());
      if (filters.endDate)
        params.append("endDate", filters.endDate.toISOString());
      if (filters.categoryId)
        params.append("categoryId", filters.categoryId.toString());
      if (filters.accountId)
        params.append("accountId", filters.accountId.toString());
    }
    const queryString = params.toString();
    return this.http.get<Income[]>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`,
    );
  }

  getIncomeById(id: number): Observable<Income> {
    return this.http.get<Income>(`${this.baseUrl}/${id}`);
  }

  createIncome(income: CreateIncomeDto): Observable<Income> {
    return this.http.post<Income>(this.baseUrl, income);
  }

  updateIncome(id: number, income: UpdateIncomeDto): Observable<Income> {
    return this.http.put<Income>(`${this.baseUrl}/${id}`, income);
  }

  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
