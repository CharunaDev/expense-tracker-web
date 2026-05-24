import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "../models/budget.model";

@Injectable({
  providedIn: "root",
})
export class BudgetService {
  private baseUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getBudgets(year: number, month?: number): Observable<Budget[]> {
    let params = new URLSearchParams();
    params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return this.http.get<Budget[]>(`${this.baseUrl}?${params.toString()}`);
  }

  getBudgetById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`);
  }

  createBudget(budget: CreateBudgetDto): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, budget);
  }

  updateBudget(id: number, budget: UpdateBudgetDto): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/${id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
