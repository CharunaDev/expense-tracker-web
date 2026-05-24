// src/app/pages/dashboard/dashboard.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Chart, registerables } from "chart.js";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { DashboardService } from "../../services/dashboard.service";
import { BudgetService } from "../../services/budget.service";

Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("expenseChart") expenseChartRef!: ElementRef;
  @ViewChild("trendChart") trendChartRef!: ElementRef;

  private expenseChart: Chart | null = null;
  private trendChart: Chart | null = null;

  currentUser: User | null = null;
  stats: any = {
    totalExpenses: 0,
    totalIncomes: 0,
    currentBalance: 0,
    currentMonthExpenses: 0,
    recentTransactions: [],
    expenseByCategory: [],
    expenseByMonth: [],
  };

  budgetPercentage = 0;
  Math = Math;
  isLoading = true;
  private chartsInitialized = false;

  constructor(
    private dashboardService: DashboardService,
    private budgetService: BudgetService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Check authentication first
    // if (!this.authService.isAuthenticated()) {
    //   return; // Let AuthGuard handle redirect
    // }

    // this.authService.currentUser$.subscribe((user) => {
    //   this.currentUser = user;
    // });

    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Wait for initial data to load before creating charts
    // Charts will be created after data loads
  }

  ngOnDestroy() {
    // Destroy charts when component is destroyed
    this.destroyCharts();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;

        // Calculate budget percentage first
        this.calculateBudgetPercentage();

        // Create charts after data is loaded and DOM is ready
        setTimeout(() => {
          this.createCharts();
        }, 100);
      },
      error: (error) => {
        console.error("Error loading dashboard data:", error);
        this.isLoading = false;

        // Handle 401 unauthorized
        if (error.status === 401) {
          this.authService.logout();
        }
      },
    });
  }

  calculateBudgetPercentage() {
    // Calculate budget percentage based on monthly budget vs actual expenses
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    this.budgetService.getBudgets(currentYear, currentMonth).subscribe({
      next: (budgets) => {
        const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
        if (totalBudget > 0) {
          this.budgetPercentage = Math.round(
            (this.stats.currentMonthExpenses / totalBudget) * 100,
          );
        }
      },
      error: (error) => {
        console.error("Error loading budgets:", error);
      },
    });
  }

  private destroyCharts() {
    if (this.expenseChart) {
      this.expenseChart.destroy();
      this.expenseChart = null;
    }
    if (this.trendChart) {
      this.trendChart.destroy();
      this.trendChart = null;
    }
    this.chartsInitialized = false;
  }

  createCharts() {
    // Check if view children are available
    if (!this.expenseChartRef || !this.trendChartRef) {
      console.log("Chart refs not available yet");
      return;
    }

    // Check if there's data to display
    if (
      !this.stats.expenseByCategory ||
      this.stats.expenseByCategory.length === 0
    ) {
      console.log("No category data available for charts");
      return;
    }

    // Destroy existing charts before creating new ones
    this.destroyCharts();

    try {
      // Expense by Category Chart (Pie)
      this.expenseChart = new Chart(this.expenseChartRef.nativeElement, {
        type: "pie",
        data: {
          labels: this.stats.expenseByCategory.map((item: any) => item.name),
          datasets: [
            {
              data: this.stats.expenseByCategory.map((item: any) => item.value),
              backgroundColor: [
                "#3b82f6",
                "#ef4444",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
                "#06b6d4",
                "#f97316",
                "#6366f1",
                "#14b8a6",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });

      // Monthly Trend Chart (Line)
      if (this.stats.expenseByMonth && this.stats.expenseByMonth.length > 0) {
        this.trendChart = new Chart(this.trendChartRef.nativeElement, {
          type: "line",
          data: {
            labels: this.stats.expenseByMonth.map((item: any) => item.month),
            datasets: [
              {
                label: "Expenses",
                data: this.stats.expenseByMonth.map((item: any) => item.amount),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        });
      }

      this.chartsInitialized = true;
    } catch (error) {
      console.error("Error creating charts:", error);
    }
  }
}
