import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Receipt, Category, Account } from '../../models/expense.model';

@Component({
  selector: 'app-scan-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scan-receipt.component.html'
})
export class ScanReceiptComponent implements OnInit {
  uploadedReceipt: Receipt | null = null;
  receipts: Receipt[] = [];
  expenseCategories: Category[] = [];
  accounts: Account[] = [];
  isProcessing = false;
  expenseForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      merchantName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      expenseDate: [new Date().toISOString().split('T')[0], Validators.required],
      categoryId: ['', Validators.required],
      accountId: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadReceipts();
  }

  loadData() {
    this.apiService.getCategories('expense').subscribe(categories => {
      this.expenseCategories = categories;
    });
    this.apiService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  loadReceipts() {
    this.apiService.getReceipts().subscribe(receipts => {
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
    this.apiService.uploadReceipt(file).subscribe(receipt => {
      this.uploadedReceipt = receipt;
      this.isProcessing = false;
      
      // Auto-fill form with OCR data
      this.expenseForm.patchValue({
        merchantName: receipt.merchantName,
        amount: receipt.totalAmount,
        expenseDate: new Date(receipt.receiptDate).toISOString().split('T')[0]
      });
      
      this.loadReceipts();
    });
  }

  clearUpload() {
    this.uploadedReceipt = null;
    this.expenseForm.reset({
      expenseDate: new Date().toISOString().split('T')[0]
    });
  }

  convertToExpense() {
    if (this.expenseForm.valid && this.uploadedReceipt) {
      this.apiService.processReceipt(this.uploadedReceipt.id, this.expenseForm.value).subscribe(() => {
        this.clearUpload();
        this.loadReceipts();
        alert('Expense created successfully!');
      });
    }
  }
}