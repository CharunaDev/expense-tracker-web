// src/app/interceptors/auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const token = authService.getToken();

  // Attach JWT token if it exists (works on both server and client)
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle response/errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("INTERCEPTOR ERROR STATUS:", error.status);

      // Only redirect on client-side
      if (error.status === 401 && isBrowser) {
        console.log("401 DETECTED -> LOGOUT");
        authService.logout();
        router.navigate(["/login"], {
          queryParams: { sessionExpired: true },
        });
      }

      return throwError(() => error);
    }),
  );
};
