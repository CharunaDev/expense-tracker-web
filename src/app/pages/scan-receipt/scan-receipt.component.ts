import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Account } from "../../models/account.model";
import { Category } from "../../models/category.model";
import { Receipt } from "../../models/receipt.model";
import { ReceiptService } from "../../services/receipt.service";
import { AccountService } from "../../services/account.service";
import { CategoryService } from "../../services/category.service";

@Component({
  selector: "app-scan-receipt",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./scan-receipt.component.html",
})
export class ScanReceiptComponent implements OnInit {
  uploadedReceipt: Receipt | null = null;
  receipts: Receipt[] = [];
  expenseCategories: Category[] = [];
  accounts: Account[] = [];
  isProcessing = false;
  expenseForm: FormGroup;

  constructor(
    private receiptService: ReceiptService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.expenseForm = this.fb.group({
      merchantName: ["", Validators.required],
      amount: ["", [Validators.required, Validators.min(0.01)]],
      expenseDate: [
        new Date().toISOString().split("T")[0],
        Validators.required,
      ],
      categoryId: ["", Validators.required],
      accountId: ["", Validators.required],
      note: [""],
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadReceipts();
  }

  loadData() {
    this.categoryService.getCategories("expense").subscribe((categories) => {
      this.expenseCategories = categories;
    });
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  loadReceipts() {
    this.receiptService.getReceipts().subscribe((receipts) => {
      this.receipts = receipts;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file: File) {
    this.isProcessing = true;
    this.receiptService.uploadReceipt(file).subscribe((receipt) => {
      this.uploadedReceipt = receipt;
      this.isProcessing = false;

      // Auto-fill form with OCR data
      this.expenseForm.patchValue({
        merchantName: receipt.merchantName,
        amount: receipt.totalAmount,
        expenseDate: new Date(receipt.receiptDate).toISOString().split("T")[0],
      });

      this.loadReceipts();
    });
  }

  clearUpload() {
    this.uploadedReceipt = null;
    this.expenseForm.reset({
      expenseDate: new Date().toISOString().split("T")[0],
    });
  }

  convertToExpense() {
    if (this.expenseForm.valid && this.uploadedReceipt) {
      this.receiptService
        .processReceipt(this.uploadedReceipt.id, this.expenseForm.value)
        .subscribe(() => {
          this.clearUpload();
          this.loadReceipts();
          alert("Expense created successfully!");
        });
    }
  }
}
