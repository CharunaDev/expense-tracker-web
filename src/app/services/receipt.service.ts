import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Receipt, ProcessReceiptDto } from "../models/receipt.model";
import { Expense } from "../models/expense.model";

@Injectable({
  providedIn: "root",
})
export class ReceiptService {
  private baseUrl = `${environment.apiUrl}/receipts`;

  constructor(private http: HttpClient) {}

  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.baseUrl);
  }

  getReceiptById(id: number): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.baseUrl}/${id}`);
  }

  uploadReceipt(file: File): Observable<Receipt> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<Receipt>(`${this.baseUrl}/upload`, formData);
  }

  processReceipt(id: number, data: ProcessReceiptDto): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/${id}/process`, data);
  }

  deleteReceipt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
