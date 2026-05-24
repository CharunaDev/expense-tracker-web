import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Expense } from "../models/expense.model";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  private baseUrl = `${environment.apiUrl}/Expense`;

  constructor(private http: HttpClient) {}

  getExpenses(filters?: any): Observable<Expense[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<Expense[]>(this.baseUrl, { params });
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }

  createExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense);
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
