// src/app/services/auth.service.ts (UPDATED)
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, LoginRequest, AuthResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const storedUser = this.storageService.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        if (this.isBrowser) {
          this.storageService.setItem('token', response.token);
          this.storageService.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
      })
    );
  }
  
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.register(data).pipe(
      tap(response => {
        if (this.isBrowser) {
          this.storageService.setItem('token', response.token);
          this.storageService.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
      })
    );
  }
  
  logout(): void {
    if (this.isBrowser) {
      this.storageService.removeItem('token');
      this.storageService.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    if (this.isBrowser) {
      return this.storageService.getItem('token');
    }
    return null;
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  hasRole(role: string): boolean {
    return true;
  }
}