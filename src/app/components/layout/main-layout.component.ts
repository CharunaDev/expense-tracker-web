// src/app/components/layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  mobileMenuOpen = false;
  showUserMenu = false;
  currentUser: User | null = null;
  
  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { path: '/expenses', label: 'Expenses', icon: 'pi pi-arrow-down' },
    { path: '/incomes', label: 'Incomes', icon: 'pi pi-arrow-up' },
    { path: '/budgets', label: 'Budgets', icon: 'pi pi-chart-line' },
    { path: '/accounts', label: 'Accounts', icon: 'pi pi-credit-card' },
    { path: '/scan', label: 'Scan Receipt', icon: 'pi pi-camera' },
    { path: '/categories', label: 'Categories', icon: 'pi pi-tags' },
    { path: '/reports', label: 'Reports', icon: 'pi pi-chart-bar' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
  }
}