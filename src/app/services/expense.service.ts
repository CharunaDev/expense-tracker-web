import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFilters,
} from "../models/expense.model";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  private baseUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getExpenses(filters?: ExpenseFilters): Observable<Expense[]> {
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
    return this.http.get<Expense[]>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`,
    );
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }

  createExpense(expense: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense);
  }

  updateExpense(id: number, expense: UpdateExpenseDto): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
