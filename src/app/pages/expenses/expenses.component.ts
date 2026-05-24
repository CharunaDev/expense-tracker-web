import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ExpenseService } from "../../services/expense.service";
import { CategoryService } from "../../services/category.service";
import { Account } from "../../models/account.model";
import { Category } from "../../models/category.model";
import { Expense } from "../../models/expense.model";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-expenses",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./expenses.component.html",
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  expenseCategories: Category[] = [];
  accounts: Account[] = [];
  showModal = false;
  editingExpense: Expense | null = null;
  expenseForm: FormGroup;

  filters = {
    startDate: "",
    endDate: "",
    categoryId: null as number | null,
    accountId: null as number | null,
  };

  totalExpenses = 0;
  averagePerDay = 0;
  highestExpense = 0;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private fb: FormBuilder,
  ) {
    this.expenseForm = this.fb.group({
      amount: ["", [Validators.required, Validators.min(0.01)]],
      expenseDate: [
        new Date().toISOString().split("T")[0],
        Validators.required,
      ],
      merchantName: ["", Validators.required],
      categoryId: ["", Validators.required],
      accountId: ["", Validators.required],
      note: [""],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadCategories();
    this.loadAccounts();
    this.loadExpenses();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.expenseCategories = categories.filter((c) => c.type === "expense");
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe((expenses) => {
      this.expenses = expenses;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    this.highestExpense = Math.max(...this.expenses.map((e) => e.amount), 0);

    if (this.filters.startDate && this.filters.endDate) {
      const days = Math.ceil(
        (new Date(this.filters.endDate).getTime() -
          new Date(this.filters.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      this.averagePerDay =
        days > 0 ? this.totalExpenses / days : this.totalExpenses;
    } else {
      this.averagePerDay = this.totalExpenses / 30; // Approximate monthly average
    }
  }

  openExpenseModal(expense?: Expense) {
    this.editingExpense = expense || null;
    if (expense) {
      this.expenseForm.patchValue({
        amount: expense.amount,
        expenseDate: new Date(expense.expenseDate).toISOString().split("T")[0],
        merchantName: expense.merchantName,
        categoryId: expense.categoryId,
        accountId: expense.accountId,
        note: expense.note,
      });
    } else {
      this.expenseForm.reset({
        expenseDate: new Date().toISOString().split("T")[0],
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingExpense = null;
    this.expenseForm.reset();
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("fixed")) {
      this.closeModal();
    }
  }

  saveExpense() {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;

      if (this.editingExpense) {
        this.expenseService
          .updateExpense(this.editingExpense.id, expenseData)
          .subscribe(() => {
            this.loadExpenses();
            this.closeModal();
          });
      } else {
        this.expenseService.createExpense(expenseData).subscribe(() => {
          this.loadExpenses();
          this.closeModal();
        });
      }
    }
  }

  editExpense(expense: Expense) {
    this.openExpenseModal(expense);
  }

  deleteExpense(id: number) {
    if (confirm("Are you sure you want to delete this expense?")) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.loadExpenses();
      });
    }
  }
}
