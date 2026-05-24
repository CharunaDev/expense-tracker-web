import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IncomeService } from "../../services/income.service";
import { Account } from "../../models/account.model";
import { Category } from "../../models/category.model";
import { Income } from "../../models/income.model";
import { AccountService } from "../../services/account.service";
import { CategoryService } from "../../services/category.service";

@Component({
  selector: "app-incomes",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./incomes.component.html",
})
export class IncomesComponent implements OnInit {
  incomes: Income[] = [];
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  accounts: Account[] = [];
  showModal = false;
  editingIncome: Income | null = null;
  incomeForm: FormGroup;

  filters = {
    startDate: "",
    endDate: "",
    categoryId: null as number | null,
  };

  totalIncomes = 0;
  averagePerDay = 0;
  highestIncome = 0;

  constructor(
    private incomeService: IncomeService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.incomeForm = this.fb.group({
      amount: ["", [Validators.required, Validators.min(0.01)]],
      incomeDate: [new Date().toISOString().split("T")[0], Validators.required],
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
    this.loadIncomes();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.incomeCategories = categories.filter((c) => c.type === "income");
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  loadIncomes() {
    this.incomeService.getIncomes().subscribe((incomes) => {
      this.incomes = incomes;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.totalIncomes = this.incomes.reduce((sum, i) => sum + i.amount, 0);
    this.highestIncome = Math.max(...this.incomes.map((i) => i.amount), 0);

    if (this.filters.startDate && this.filters.endDate) {
      const days = Math.ceil(
        (new Date(this.filters.endDate).getTime() -
          new Date(this.filters.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      this.averagePerDay =
        days > 0 ? this.totalIncomes / days : this.totalIncomes;
    } else {
      this.averagePerDay = this.totalIncomes / 30;
    }
  }

  openIncomeModal(income?: Income) {
    this.editingIncome = income || null;
    if (income) {
      this.incomeForm.patchValue({
        amount: income.amount,
        incomeDate: new Date(income.incomeDate).toISOString().split("T")[0],
        categoryId: income.categoryId,
        accountId: income.accountId,
        note: income.note,
      });
    } else {
      this.incomeForm.reset({
        incomeDate: new Date().toISOString().split("T")[0],
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingIncome = null;
    this.incomeForm.reset();
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("fixed")) {
      this.closeModal();
    }
  }

  saveIncome() {
    if (this.incomeForm.valid) {
      const incomeData = this.incomeForm.value;

      if (this.editingIncome) {
        this.incomeService
          .updateIncome(this.editingIncome.id, incomeData)
          .subscribe(() => {
            this.loadIncomes();
            this.closeModal();
          });
      } else {
        this.incomeService.createIncome(incomeData).subscribe(() => {
          this.loadIncomes();
          this.closeModal();
        });
      }
    }
  }

  editIncome(income: Income) {
    this.openIncomeModal(income);
  }

  deleteIncome(id: number) {
    if (confirm("Are you sure you want to delete this income?")) {
      this.incomeService.deleteIncome(id).subscribe(() => {
        this.loadIncomes();
      });
    }
  }
}
