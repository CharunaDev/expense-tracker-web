// src/app/app.routes.ts (UPDATED with all components)
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'expenses', loadComponent: () => import('./pages/expenses/expenses.component').then(m => m.ExpensesComponent) },
      { path: 'incomes', loadComponent: () => import('./pages/incomes/incomes.component').then(m => m.IncomesComponent) },
      { path: 'budgets', loadComponent: () => import('./pages/budgets/budgets.component').then(m => m.BudgetsComponent) },
      { path: 'accounts', loadComponent: () => import('./pages/accounts/accounts.component').then(m => m.AccountsComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'scan', loadComponent: () => import('./pages/scan-receipt/scan-receipt.component').then(m => m.ScanReceiptComponent) },
      { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent) }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];