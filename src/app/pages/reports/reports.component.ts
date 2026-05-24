import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Chart, registerables } from "chart.js";
import { ReportService } from "../../services/report.service";

Chart.register(...registerables);

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reports.component.html",
})
export class ReportsComponent implements AfterViewInit {
  @ViewChild("expenseChart") expenseChartRef!: ElementRef;
  @ViewChild("incomeChart") incomeChartRef!: ElementRef;

  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];
  endDate = new Date().toISOString().split("T")[0];
  reportType = "all";
  reportData: any = null;

  private expenseChart: Chart | null = null;
  private incomeChart: Chart | null = null;

  constructor(private reportsService: ReportService) {}

  ngAfterViewInit() {
    this.generateReport();
  }

  generateReport() {
    const type = this.reportType === "all" ? undefined : this.reportType;
    this.reportsService
      .generateReport(new Date(this.startDate), new Date(this.endDate), type)
      .subscribe((data) => {
        this.reportData = data;
        setTimeout(() => this.createCharts(), 100);
      });
  }

  getSavingsRate(): number {
    if (this.reportData && this.reportData.totalIncomes > 0) {
      return Math.round(
        (this.reportData.netSavings / this.reportData.totalIncomes) * 100,
      );
    }
    return 0;
  }

  createCharts() {
    if (!this.expenseChartRef || !this.incomeChartRef) return;

    if (this.expenseChart) this.expenseChart.destroy();
    if (this.incomeChart) this.incomeChart.destroy();

    // Expense Chart
    if (
      this.reportData.expenseByCategory &&
      this.reportData.expenseByCategory.length > 0
    ) {
      this.expenseChart = new Chart(this.expenseChartRef.nativeElement, {
        type: "pie",
        data: {
          labels: this.reportData.expenseByCategory.map(
            (item: any) => item.name,
          ),
          datasets: [
            {
              data: this.reportData.expenseByCategory.map(
                (item: any) => item.value,
              ),
              backgroundColor: [
                "#ef4444",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
                "#06b6d4",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }

    // Income Chart
    if (
      this.reportData.incomeByCategory &&
      this.reportData.incomeByCategory.length > 0
    ) {
      this.incomeChart = new Chart(this.incomeChartRef.nativeElement, {
        type: "pie",
        data: {
          labels: this.reportData.incomeByCategory.map(
            (item: any) => item.name,
          ),
          datasets: [
            {
              data: this.reportData.incomeByCategory.map(
                (item: any) => item.value,
              ),
              backgroundColor: [
                "#10b981",
                "#3b82f6",
                "#14b8a6",
                "#6366f1",
                "#8b5cf6",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }
  }
}
