// src/app/services/api.service.ts (UPDATED - SSR Safe)
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Category, Account, Expense, Income, MonthlyBudget, Receipt } from '../models/expense.model';
import { LoginRequest, AuthResponse, RegisterRequest } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private mockData: any;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initMockData();
    } else {
      // Server-side mock data without localStorage
      this.mockData = this.getDefaultMockData();
    }
  }

  private getDefaultMockData() {
    const defaultCategories = [
      { id: 1, userId: 1, name: 'Food & Dining', type: 'expense', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 2, userId: 1, name: 'Transportation', type: 'expense', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 3, userId: 1, name: 'Shopping', type: 'expense', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 4, userId: 1, name: 'Entertainment', type: 'expense', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 5, userId: 1, name: 'Bills & Utilities', type: 'expense', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 6, userId: 1, name: 'Salary', type: 'income', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 7, userId: 1, name: 'Freelance', type: 'income', isActive: true, createdAt: new Date(), createdBy: 1 },
      { id: 8, userId: 1, name: 'Investments', type: 'income', isActive: true, createdAt: new Date(), createdBy: 1 }
    ];
    
    return {
      users: [
        {
          id: 1,
          email: 'demo@example.com',
          displayName: 'Demo User',
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        }
      ],
      categories: defaultCategories,
      accounts: [
        {
          id: 1,
          userId: 1,
          name: 'Cash',
          accountType: 'cash',
          openingBalance: 1000,
          currentBalance: 1500,
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        },
        {
          id: 2,
          userId: 1,
          name: 'Bank Account',
          accountType: 'bank',
          openingBalance: 5000,
          currentBalance: 4500,
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        }
      ],
      expenses: [
        {
          id: 1,
          userId: 1,
          categoryId: 1,
          accountId: 1,
          amount: 45.50,
          expenseDate: new Date(),
          merchantName: 'Supermarket',
          note: 'Weekly groceries',
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        },
        {
          id: 2,
          userId: 1,
          categoryId: 2,
          accountId: 2,
          amount: 30.00,
          expenseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          merchantName: 'Uber',
          note: 'Ride to office',
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        }
      ],
      incomes: [
        {
          id: 1,
          userId: 1,
          categoryId: 6,
          accountId: 2,
          amount: 5000,
          incomeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          note: 'Monthly salary',
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        }
      ],
      budgets: [],
      receipts: [],
      currentUserId: 1
    };
  }

  private initMockData() {
    if (!this.isBrowser) return;
    
    const stored = localStorage.getItem('dmywallet_data');
    if (stored) {
      this.mockData = JSON.parse(stored);
    } else {
      this.mockData = this.getDefaultMockData();
      this.saveMockData();
    }
  }

  private saveMockData() {
    if (this.isBrowser) {
      localStorage.setItem('dmywallet_data', JSON.stringify(this.mockData));
    }
  }

  // Auth endpoints
  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return of({
        token: 'mock-jwt-token-' + Date.now(),
        user: this.mockData.users[0],
        roles: ['user']
      }).pipe(delay(500));
    }
    
    const user = this.mockData.users.find((u: any) => u.email === credentials.email);
    if (!user && credentials.email === 'demo@example.com') {
      const newUser = {
        id: this.mockData.users.length + 1,
        email: credentials.email,
        displayName: credentials.email.split('@')[0],
        isActive: true,
        createdAt: new Date(),
        createdBy: 1
      };
      this.mockData.users.push(newUser);
      this.mockData.currentUserId = newUser.id;
      this.saveMockData();
      
      return of({
        token: 'mock-jwt-token-' + Date.now(),
        user: newUser,
        roles: ['user']
      }).pipe(delay(500));
    }
    
    if (user) {
      this.mockData.currentUserId = user.id;
      this.saveMockData();
      return of({
        token: 'mock-jwt-token-' + Date.now(),
        user: user,
        roles: ['user']
      }).pipe(delay(500));
    }
    
    return of({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: this.mockData.users.length + 1,
        email: credentials.email,
        displayName: credentials.email.split('@')[0],
        isActive: true,
        createdAt: new Date(),
        createdBy: 1
      },
      roles: ['user']
    }).pipe(delay(500));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const newUser = {
      id: this.mockData.users.length + 1,
      email: data.email,
      displayName: data.displayName,
      isActive: true,
      createdAt: new Date(),
      createdBy: 1
    };
    this.mockData.users.push(newUser);
    this.mockData.currentUserId = newUser.id;
    this.saveMockData();
    
    return of({
      token: 'mock-jwt-token-' + Date.now(),
      user: newUser,
      roles: ['user']
    }).pipe(delay(500));
  }

  // Categories
  getCategories(type?: string): Observable<Category[]> {
    let categories = this.mockData.categories.filter((c: any) => c.userId === this.mockData.currentUserId);
    if (type) {
      categories = categories.filter((c: any) => c.type === type);
    }
    return of(categories.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      name: c.name,
      type: c.type,
      isActive: c.isActive
    }))).pipe(delay(300));
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    const newCategory: Category = {
      id: this.mockData.categories.length + 1,
      userId: this.mockData.currentUserId,
      name: category.name!,
      type: category.type!,
      isActive: true
    };
    this.mockData.categories.push({
      ...newCategory,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    return of(newCategory).pipe(delay(300));
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    const index = this.mockData.categories.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      this.mockData.categories[index] = { 
        ...this.mockData.categories[index], 
        ...category,
        modifiedAt: new Date(),
        modifiedBy: this.mockData.currentUserId
      };
      this.saveMockData();
      return of(this.mockData.categories[index]).pipe(delay(300));
    }
    throw new Error('Category not found');
  }

  deleteCategory(id: number): Observable<void> {
    const index = this.mockData.categories.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      this.mockData.categories.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Accounts
  getAccounts(): Observable<Account[]> {
    const accounts = this.mockData.accounts.filter((a: any) => a.userId === this.mockData.currentUserId);
    return of(accounts.map((a: any) => ({
      id: a.id,
      userId: a.userId,
      name: a.name,
      accountType: a.accountType,
      openingBalance: a.openingBalance,
      currentBalance: a.currentBalance,
      isActive: a.isActive
    }))).pipe(delay(300));
  }

  createAccount(account: Partial<Account>): Observable<Account> {
    const newAccount: Account = {
      id: this.mockData.accounts.length + 1,
      userId: this.mockData.currentUserId,
      name: account.name!,
      accountType: account.accountType!,
      openingBalance: account.openingBalance || 0,
      currentBalance: account.openingBalance || 0,
      isActive: true
    };
    this.mockData.accounts.push({
      ...newAccount,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    return of(newAccount).pipe(delay(300));
  }

  updateAccount(id: number, account: Partial<Account>): Observable<Account> {
    const index = this.mockData.accounts.findIndex((a: any) => a.id === id);
    if (index !== -1) {
      this.mockData.accounts[index] = { 
        ...this.mockData.accounts[index], 
        ...account,
        modifiedAt: new Date(),
        modifiedBy: this.mockData.currentUserId
      };
      this.saveMockData();
      return of(this.mockData.accounts[index]).pipe(delay(300));
    }
    throw new Error('Account not found');
  }

  deleteAccount(id: number): Observable<void> {
    const index = this.mockData.accounts.findIndex((a: any) => a.id === id);
    if (index !== -1) {
      this.mockData.accounts.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Expenses
  getExpenses(filters?: any): Observable<Expense[]> {
    let expenses = this.mockData.expenses.filter((e: any) => e.userId === this.mockData.currentUserId);
    if (filters) {
      if (filters.startDate) {
        expenses = expenses.filter((e: any) => new Date(e.expenseDate) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        expenses = expenses.filter((e: any) => new Date(e.expenseDate) <= new Date(filters.endDate));
      }
      if (filters.categoryId) {
        expenses = expenses.filter((e: any) => e.categoryId === filters.categoryId);
      }
      if (filters.accountId) {
        expenses = expenses.filter((e: any) => e.accountId === filters.accountId);
      }
    }
    
    const enrichedExpenses = expenses.map((e: any) => ({
      ...e,
      category: this.mockData.categories.find((c: any) => c.id === e.categoryId),
      account: this.mockData.accounts.find((a: any) => a.id === e.accountId)
    }));
    
    return of(enrichedExpenses).pipe(delay(300));
  }

  getExpenseById(id: number): Observable<Expense> {
    const expense = this.mockData.expenses.find((e: any) => e.id === id && e.userId === this.mockData.currentUserId);
    if (expense) {
      expense.category = this.mockData.categories.find((c: any) => c.id === expense.categoryId);
      expense.account = this.mockData.accounts.find((a: any) => a.id === expense.accountId);
      return of(expense).pipe(delay(300));
    }
    throw new Error('Expense not found');
  }

  createExpense(expense: Partial<Expense>): Observable<Expense> {
    const newExpense: Expense = {
      id: this.mockData.expenses.length + 1,
      userId: this.mockData.currentUserId,
      categoryId: expense.categoryId!,
      accountId: expense.accountId!,
      amount: expense.amount!,
      expenseDate: expense.expenseDate!,
      merchantName: expense.merchantName || '',
      note: expense.note || '',
      isActive: true
    };
    this.mockData.expenses.push({
      ...newExpense,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    
    const account = this.mockData.accounts.find((a: any) => a.id === expense.accountId);
    if (account && expense.amount) {
      account.currentBalance -= expense.amount;
      this.saveMockData();
    }
    
    return of(newExpense).pipe(delay(300));
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    const index = this.mockData.expenses.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      const oldExpense = this.mockData.expenses[index];
      const oldAccount = this.mockData.accounts.find((a: any) => a.id === oldExpense.accountId);
      if (oldAccount && oldExpense.amount) {
        oldAccount.currentBalance += oldExpense.amount;
      }
      
      this.mockData.expenses[index] = { 
        ...this.mockData.expenses[index], 
        ...expense,
        modifiedAt: new Date(),
        modifiedBy: this.mockData.currentUserId
      };
      
      const newAccount = this.mockData.accounts.find((a: any) => a.id === expense.accountId);
      if (newAccount && expense.amount) {
        newAccount.currentBalance -= expense.amount;
      }
      
      this.saveMockData();
      return of(this.mockData.expenses[index]).pipe(delay(300));
    }
    throw new Error('Expense not found');
  }

  deleteExpense(id: number): Observable<void> {
    const index = this.mockData.expenses.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      const expense = this.mockData.expenses[index];
      const account = this.mockData.accounts.find((a: any) => a.id === expense.accountId);
      if (account) {
        account.currentBalance += expense.amount;
      }
      this.mockData.expenses.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Incomes
  getIncomes(filters?: any): Observable<Income[]> {
    let incomes = this.mockData.incomes.filter((i: any) => i.userId === this.mockData.currentUserId);
    if (filters) {
      if (filters.startDate) {
        incomes = incomes.filter((i: any) => new Date(i.incomeDate) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        incomes = incomes.filter((i: any) => new Date(i.incomeDate) <= new Date(filters.endDate));
      }
      if (filters.categoryId) {
        incomes = incomes.filter((i: any) => i.categoryId === filters.categoryId);
      }
      if (filters.accountId) {
        incomes = incomes.filter((i: any) => i.accountId === filters.accountId);
      }
    }
    
    const enrichedIncomes = incomes.map((i: any) => ({
      ...i,
      category: this.mockData.categories.find((c: any) => c.id === i.categoryId),
      account: this.mockData.accounts.find((a: any) => a.id === i.accountId)
    }));
    
    return of(enrichedIncomes).pipe(delay(300));
  }

  getIncomeById(id: number): Observable<Income> {
    const income = this.mockData.incomes.find((i: any) => i.id === id && i.userId === this.mockData.currentUserId);
    if (income) {
      income.category = this.mockData.categories.find((c: any) => c.id === income.categoryId);
      income.account = this.mockData.accounts.find((a: any) => a.id === income.accountId);
      return of(income).pipe(delay(300));
    }
    throw new Error('Income not found');
  }

  createIncome(income: Partial<Income>): Observable<Income> {
    const newIncome: Income = {
      id: this.mockData.incomes.length + 1,
      userId: this.mockData.currentUserId,
      categoryId: income.categoryId!,
      accountId: income.accountId!,
      amount: income.amount!,
      incomeDate: income.incomeDate!,
      note: income.note || '',
      isActive: true
    };
    this.mockData.incomes.push({
      ...newIncome,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    
    const account = this.mockData.accounts.find((a: any) => a.id === income.accountId);
    if (account && income.amount) {
      account.currentBalance += income.amount;
      this.saveMockData();
    }
    
    return of(newIncome).pipe(delay(300));
  }

  updateIncome(id: number, income: Partial<Income>): Observable<Income> {
    const index = this.mockData.incomes.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      const oldIncome = this.mockData.incomes[index];
      const oldAccount = this.mockData.accounts.find((a: any) => a.id === oldIncome.accountId);
      if (oldAccount && oldIncome.amount) {
        oldAccount.currentBalance -= oldIncome.amount;
      }
      
      this.mockData.incomes[index] = { 
        ...this.mockData.incomes[index], 
        ...income,
        modifiedAt: new Date(),
        modifiedBy: this.mockData.currentUserId
      };
      
      const newAccount = this.mockData.accounts.find((a: any) => a.id === income.accountId);
      if (newAccount && income.amount) {
        newAccount.currentBalance += income.amount;
      }
      
      this.saveMockData();
      return of(this.mockData.incomes[index]).pipe(delay(300));
    }
    throw new Error('Income not found');
  }

  deleteIncome(id: number): Observable<void> {
    const index = this.mockData.incomes.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      const income = this.mockData.incomes[index];
      const account = this.mockData.accounts.find((a: any) => a.id === income.accountId);
      if (account) {
        account.currentBalance -= income.amount;
      }
      this.mockData.incomes.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Budgets
  getBudgets(year: number, month?: number): Observable<MonthlyBudget[]> {
    let budgets = this.mockData.budgets.filter((b: any) => b.userId === this.mockData.currentUserId && b.year === year);
    if (month) {
      budgets = budgets.filter((b: any) => b.month === month);
    }
    
    const enrichedBudgets = budgets.map((b: any) => {
      const expenses = this.mockData.expenses.filter((e: any) => 
        e.userId === this.mockData.currentUserId && 
        e.categoryId === b.categoryId &&
        new Date(e.expenseDate).getFullYear() === year &&
        new Date(e.expenseDate).getMonth() + 1 === b.month
      );
      const spentAmount = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
      
      return {
        ...b,
        spentAmount,
        category: this.mockData.categories.find((c: any) => c.id === b.categoryId)
      };
    });
    
    return of(enrichedBudgets).pipe(delay(300));
  }

  createBudget(budget: Partial<MonthlyBudget>): Observable<MonthlyBudget> {
    const newBudget: MonthlyBudget = {
      id: this.mockData.budgets.length + 1,
      userId: this.mockData.currentUserId,
      categoryId: budget.categoryId!,
      month: budget.month!,
      year: budget.year!,
      budgetAmount: budget.budgetAmount!,
      spentAmount: 0
    };
    this.mockData.budgets.push({
      ...newBudget,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    return of(newBudget).pipe(delay(300));
  }

  updateBudget(id: number, budget: Partial<MonthlyBudget>): Observable<MonthlyBudget> {
    const index = this.mockData.budgets.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      this.mockData.budgets[index] = { 
        ...this.mockData.budgets[index], 
        ...budget,
        modifiedAt: new Date(),
        modifiedBy: this.mockData.currentUserId
      };
      this.saveMockData();
      return of(this.mockData.budgets[index]).pipe(delay(300));
    }
    throw new Error('Budget not found');
  }

  deleteBudget(id: number): Observable<void> {
    const index = this.mockData.budgets.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      this.mockData.budgets.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Receipts
  uploadReceipt(file: File): Observable<Receipt> {
    const newReceipt: Receipt = {
      id: this.mockData.receipts.length + 1,
      userId: this.mockData.currentUserId,
      imageUrl: URL.createObjectURL(file),
      ocrText: 'Mock OCR Text: Purchase from Store\nTotal: $45.99\nDate: ' + new Date().toLocaleDateString(),
      merchantName: 'Store Name',
      totalAmount: Math.random() * 100 + 10,
      receiptDate: new Date(),
      isProcessed: false
    };
    this.mockData.receipts.push({
      ...newReceipt,
      createdAt: new Date(),
      createdBy: this.mockData.currentUserId
    });
    this.saveMockData();
    return of(newReceipt).pipe(delay(1500));
  }

  getReceipts(): Observable<Receipt[]> {
    const receipts = this.mockData.receipts.filter((r: any) => r.userId === this.mockData.currentUserId);
    return of(receipts).pipe(delay(300));
  }

  getReceiptById(id: number): Observable<Receipt> {
    const receipt = this.mockData.receipts.find((r: any) => r.id === id && r.userId === this.mockData.currentUserId);
    if (receipt) {
      return of(receipt).pipe(delay(300));
    }
    throw new Error('Receipt not found');
  }

  processReceipt(receiptId: number, expenseData: any): Observable<Expense> {
    const receipt = this.mockData.receipts.find((r: any) => r.id === receiptId);
    if (receipt) {
      receipt.isProcessed = true;
      receipt.modifiedAt = new Date();
      receipt.modifiedBy = this.mockData.currentUserId;
      
      const newExpense: Expense = {
        id: this.mockData.expenses.length + 1,
        userId: this.mockData.currentUserId,
        categoryId: expenseData.categoryId,
        accountId: expenseData.accountId,
        receiptId: receiptId,
        amount: receipt.totalAmount,
        expenseDate: receipt.receiptDate,
        merchantName: receipt.merchantName,
        note: expenseData.note || '',
        isActive: true
      };
      
      this.mockData.expenses.push({
        ...newExpense,
        createdAt: new Date(),
        createdBy: this.mockData.currentUserId
      });
      
      const account = this.mockData.accounts.find((a: any) => a.id === expenseData.accountId);
      if (account) {
        account.currentBalance -= receipt.totalAmount;
      }
      
      this.saveMockData();
      return of(newExpense).pipe(delay(500));
    }
    throw new Error('Receipt not found');
  }

  deleteReceipt(id: number): Observable<void> {
    const index = this.mockData.receipts.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      this.mockData.receipts.splice(index, 1);
      this.saveMockData();
    }
    return of(void 0).pipe(delay(300));
  }

  // Dashboard data
  getDashboardData(): Observable<any> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expenses = this.mockData.expenses.filter((e: any) => e.userId === this.mockData.currentUserId);
    const incomes = this.mockData.incomes.filter((i: any) => i.userId === this.mockData.currentUserId);
    
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const totalIncomes = incomes.reduce((sum: number, i: any) => sum + i.amount, 0);
    const currentBalance = totalIncomes - totalExpenses;
    
    const currentMonthExpenses = expenses.filter((e: any) => {
      const date = new Date(e.expenseDate);
      return date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth;
    }).reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const recentTransactions = [...expenses, ...incomes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((t: any) => {
        const category = this.mockData.categories.find((c: any) => c.id === t.categoryId);
        return {
          ...t,
          category,
          amount: t.amount * (t.expenseDate ? 1 : -1)
        };
      });
    
    return of({
      totalExpenses,
      totalIncomes,
      currentBalance,
      currentMonthExpenses,
      recentTransactions,
      expenseByCategory: this.groupByCategory(expenses),
      expenseByMonth: this.groupByMonth(expenses)
    }).pipe(delay(300));
  }

  private groupByCategory(transactions: any[]): any[] {
    const grouped = transactions.reduce((acc: any, t: any) => {
      const category = this.mockData.categories.find((c: any) => c.id === t.categoryId);
      const categoryName = category ? category.name : 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += t.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(name => ({
      name,
      value: grouped[name]
    }));
  }

  private groupByMonth(transactions: any[]): any[] {
    const grouped = transactions.reduce((acc: any, t: any) => {
      const date = new Date(t.expenseDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += t.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).sort().map(month => ({
      month,
      amount: grouped[month]
    }));
  }

  // Reports
  getReport(startDate: Date, endDate: Date, type?: string): Observable<any> {
    let expenses = this.mockData.expenses.filter((e: any) => 
      e.userId === this.mockData.currentUserId &&
      new Date(e.expenseDate) >= startDate &&
      new Date(e.expenseDate) <= endDate
    );
    
    let incomes = this.mockData.incomes.filter((i: any) => 
      i.userId === this.mockData.currentUserId &&
      new Date(i.incomeDate) >= startDate &&
      new Date(i.incomeDate) <= endDate
    );
    
    if (type === 'expense') {
      incomes = [];
    } else if (type === 'income') {
      expenses = [];
    }
    
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const totalIncomes = incomes.reduce((sum: number, i: any) => sum + i.amount, 0);
    
    const expenseByCategory = this.groupByCategory(expenses);
    const incomeByCategory = this.groupByCategory(incomes);
    
    return of({
      startDate,
      endDate,
      totalExpenses,
      totalIncomes,
      netSavings: totalIncomes - totalExpenses,
      expenseByCategory,
      incomeByCategory,
      expenses: expenses.map((e: any) => ({
        ...e,
        category: this.mockData.categories.find((c: any) => c.id === e.categoryId),
        account: this.mockData.accounts.find((a: any) => a.id === e.accountId)
      })),
      incomes: incomes.map((i: any) => ({
        ...i,
        category: this.mockData.categories.find((c: any) => c.id === i.categoryId),
        account: this.mockData.accounts.find((a: any) => a.id === i.accountId)
      }))
    }).pipe(delay(500));
  }
}