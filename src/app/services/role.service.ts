import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Role } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private baseUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }

  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user/${userId}`);
  }

  addUserToRole(userId: number, roleId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/user/${userId}/roles/${roleId}`,
      {},
    );
  }

  removeUserFromRole(userId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/user/${userId}/roles/${roleId}`,
    );
  }

  removeAllUserRoles(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${userId}/roles`);
  }
}
