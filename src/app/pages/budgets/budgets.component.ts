import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Category } from "../../models/category.model";
import { Budget } from "../../models/budget.model";
import { BudgetService } from "../../services/budget.service";
import { CategoryService } from "../../services/category.service";

@Component({
  selector: "app-budgets",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./budgets.component.html",
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  expenseCategories: Category[] = [];
  showModal = false;
  editingBudget: Budget | null = null;
  budgetForm: FormGroup;

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  years = [2024, 2025, 2026];
  months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  totalBudget = 0;
  totalSpent = 0;
  remainingBudget = 0;

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.budgetForm = this.fb.group({
      categoryId: ["", Validators.required],
      budgetAmount: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadBudgets();
  }

  loadCategories() {
    this.categoryService.getCategories("expense").subscribe((categories) => {
      this.expenseCategories = categories;
    });
  }

  loadBudgets() {
    this.budgetService
      .getBudgets(this.selectedYear, this.selectedMonth)
      .subscribe((budgets) => {
        this.budgets = budgets;
        this.calculateTotals();
      });
  }

  calculateTotals() {
    this.totalBudget = this.budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
    this.totalSpent = this.budgets.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0,
    );
    this.remainingBudget = this.totalBudget - this.totalSpent;
  }

  getRemainingBudget(budget: Budget): number {
    return budget.budgetAmount - budget.spentAmount || 0;
  }

  getPercentage(budget: Budget): number {
    const percentage = ((budget.spentAmount || 0) / budget.budgetAmount) * 100;
    return Math.min(percentage, 100);
  }

  openBudgetModal(budget?: Budget) {
    this.editingBudget = budget || null;
    if (budget) {
      this.budgetForm.patchValue({
        categoryId: budget.categoryId,
        budgetAmount: budget.budgetAmount,
      });
    } else {
      this.budgetForm.reset();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingBudget = null;
    this.budgetForm.reset();
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("fixed")) {
      this.closeModal();
    }
  }

  saveBudget() {
    if (this.budgetForm.valid) {
      const budgetData = {
        ...this.budgetForm.value,
        month: this.selectedMonth,
        year: this.selectedYear,
      };

      if (this.editingBudget) {
        this.budgetService
          .updateBudget(this.editingBudget.id, budgetData)
          .subscribe(() => {
            this.loadBudgets();
            this.closeModal();
          });
      } else {
        this.budgetService.createBudget(budgetData).subscribe(() => {
          this.loadBudgets();
          this.closeModal();
        });
      }
    }
  }

  editBudget(budget: Budget) {
    this.openBudgetModal(budget);
  }

  deleteBudget(id: number) {
    if (confirm("Are you sure you want to delete this budget?")) {
      this.budgetService.deleteBudget(id).subscribe(() => {
        this.loadBudgets();
      });
    }
  }
}
