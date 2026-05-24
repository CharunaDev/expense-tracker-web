import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Category } from "../models/expense.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) {}

  getCategories(type?: string): Observable<Category[]> {
    let url = this.baseUrl;

    if (type) {
      url += `?type=${type}`;
    }

    return this.http.get<Category[]>(url);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(
    id: number,
    category: Partial<Category>,
  ): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
