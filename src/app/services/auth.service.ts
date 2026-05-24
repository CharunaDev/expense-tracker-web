// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from "jwt-decode";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../models/user.model";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // IMPORTANT: Check if we're in browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Only access localStorage in browser
    if (this.isBrowser) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          // Only store auth data in browser
          if (this.isBrowser) {
            this.storeAuthData(response);
          }
        }),
        catchError(this.handleError),
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, request)
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            this.storeAuthData(response);
          }
        }),
        catchError(this.handleError),
      );
  }

  logout(): void {
    console.log("LOGOUT CALLED");

    if (this.isBrowser) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("roles");
    }

    this.currentUserSubject.next(null);

    if (this.isBrowser) {
      this.router.navigate(["/login"]);
    }
  }

  private storeAuthData(response: AuthResponse): void {
    if (!this.isBrowser) return;

    localStorage.setItem("token", response.token);
    localStorage.setItem("currentUser", JSON.stringify(response.user));
    localStorage.setItem("roles", JSON.stringify(response.roles));
    this.currentUserSubject.next(response.user);
  }

  getToken(): string | null {
    // CRITICAL: Only access localStorage in browser
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem("token");
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    // On server, always return false - let client-side handle auth
    if (!this.isBrowser) {
      return false;
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expired = this.isTokenExpired(token);
    return !expired;
  }

  hasRole(role: string): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.includes(role);
  }

  isTokenExpired(token?: string): boolean {
    const jwt = token || this.getToken();
    if (!jwt) return true;

    try {
      const decoded: any = jwtDecode(jwt);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  checkTokenExpiration(): void {
    if (!this.isBrowser) return;

    const token = this.getToken();
    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.logout();
    }
  }

  private handleError(error: HttpErrorResponse) {
    let message = "Something went wrong";
    if (error.status === 401) {
      message = "Invalid email or password";
    }
    if (error.error?.error) {
      message = error.error.error;
    }
    return throwError(() => new Error(message));
  }
}
