import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Receipt, Expense } from "../models/expense.model";

@Injectable({
  providedIn: "root",
})
export class ReceiptService {
  private baseUrl = `${environment.apiUrl}/Receipt`;

  constructor(private http: HttpClient) {}

  uploadReceipt(file: File): Observable<Receipt> {
    const formData = new FormData();

    formData.append("file", file);

    return this.http.post<Receipt>(`${this.baseUrl}/upload`, formData);
  }

  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.baseUrl);
  }

  processReceipt(receiptId: number, expenseData: any): Observable<Expense> {
    return this.http.post<Expense>(
      `${this.baseUrl}/${receiptId}/process`,
      expenseData,
    );
  }

  deleteReceipt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
