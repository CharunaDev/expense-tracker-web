// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('expenseChart') expenseChartRef!: ElementRef;
  @ViewChild('trendChart') trendChartRef!: ElementRef;
  
  currentUser: User | null = null;
  stats: any = {
    totalExpenses: 0,
    totalIncomes: 0,
    currentBalance: 0,
    currentMonthExpenses: 0,
    recentTransactions: [],
    expenseByCategory: [],
    expenseByMonth: []
  };
  
  budgetPercentage = 0;
  Math = Math;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  loadDashboardData() {
    this.apiService.getDashboardData().subscribe(data => {
      this.stats = data;
      this.calculateBudgetPercentage();
      this.createCharts();
    });
  }

  calculateBudgetPercentage() {
    // Calculate budget percentage based on monthly budget vs actual expenses
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    this.apiService.getBudgets(currentYear, currentMonth).subscribe(budgets => {
      const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
      if (totalBudget > 0) {
        this.budgetPercentage = Math.round((this.stats.currentMonthExpenses / totalBudget) * 100);
      }
    });
  }

  createCharts() {
    if (!this.expenseChartRef || !this.trendChartRef) return;
    
    // Expense by Category Chart (Pie)
    new Chart(this.expenseChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.stats.expenseByCategory.map((item: any) => item.name),
        datasets: [{
          data: this.stats.expenseByCategory.map((item: any) => item.value),
          backgroundColor: [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // Monthly Trend Chart (Line)
    new Chart(this.trendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.stats.expenseByMonth.map((item: any) => item.month),
        datasets: [{
          label: 'Expenses',
          data: this.stats.expenseByMonth.map((item: any) => item.amount),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}