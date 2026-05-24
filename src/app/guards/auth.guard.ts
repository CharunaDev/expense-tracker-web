// src/app/guards/auth.guard.ts
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  canActivate(): boolean {
    // For server-side rendering, allow access to avoid rendering issues
    // The actual auth check will happen on the client
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Client-side: perform actual auth check
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Not authenticated, redirect to login
    this.router.navigate(["/login"]);
    return false;
  }
}
