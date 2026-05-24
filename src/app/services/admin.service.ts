import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { User, UserRoleDto } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserDetails(userId: number): Observable<UserRoleDto> {
    return this.http.get<UserRoleDto>(
      `${this.baseUrl}/users/${userId}/details`,
    );
  }

  activateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/activate`, {});
  }

  deactivateUser(userId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/users/${userId}/deactivate`,
      {},
    );
  }
}
