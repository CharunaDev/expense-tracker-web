import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../models/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(type?: "expense" | "income"): Observable<Category[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set("type", type);
    }
    return this.http.get<Category[]>(this.baseUrl, { params });
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  createCategory(category: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category, {});
  }

  updateCategory(
    id: number,
    category: UpdateCategoryDto,
  ): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category, {});
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
