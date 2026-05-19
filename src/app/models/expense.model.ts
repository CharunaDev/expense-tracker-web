export interface Category {
  id: number;
  userId: number;
  name: string;
  type: 'expense' | 'income';
  isActive: boolean;
}

export interface Account {
  id: number;
  userId: number;
  name: string;
  accountType: 'cash' | 'bank' | 'card' | 'wallet';
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  accountId: number;
  receiptId?: number;
  amount: number;
  expenseDate: Date;
  merchantName: string;
  note: string;
  isActive: boolean;
  category?: Category;
  account?: Account;
}

export interface Income {
  id: number;
  userId: number;
  categoryId: number;
  accountId: number;
  amount: number;
  incomeDate: Date;
  note: string;
  isActive: boolean;
  category?: Category;
  account?: Account;
}

export interface MonthlyBudget {
  id: number;
  userId: number;
  categoryId: number;
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount?: number;
  category?: Category;
}

export interface Receipt {
  id: number;
  userId: number;
  imageUrl: string;
  ocrText: string;
  merchantName: string;
  totalAmount: number;
  receiptDate: Date;
  isProcessed: boolean;
}