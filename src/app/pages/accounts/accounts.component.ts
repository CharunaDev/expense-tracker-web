import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Account } from '../../models/expense.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  showModal = false;
  editingAccount: Account | null = null;
  accountForm: FormGroup;
  totalBalance = 0;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      accountType: ['cash', Validators.required],
      openingBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.apiService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
      this.totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
    });
  }

  openAccountModal(account?: Account) {
    this.editingAccount = account || null;
    if (account) {
      this.accountForm.patchValue({
        name: account.name,
        accountType: account.accountType,
        openingBalance: account.openingBalance
      });
    } else {
      this.accountForm.reset({ accountType: 'cash', openingBalance: 0 });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingAccount = null;
    this.accountForm.reset();
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.closeModal();
    }
  }

  saveAccount() {
    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;
      
      if (this.editingAccount) {
        this.apiService.updateAccount(this.editingAccount.id, accountData).subscribe(() => {
          this.loadAccounts();
          this.closeModal();
        });
      } else {
        this.apiService.createAccount(accountData).subscribe(() => {
          this.loadAccounts();
          this.closeModal();
        });
      }
    }
  }

  editAccount(account: Account) {
    this.openAccountModal(account);
  }

  deleteAccount(id: number) {
    if (confirm('Are you sure you want to delete this account? This will affect all related transactions.')) {
      this.apiService.deleteAccount(id).subscribe(() => {
        this.loadAccounts();
      });
    }
  }
}