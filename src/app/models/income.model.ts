import { Account } from "./account.model";
import { Category } from "./category.model";

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

export interface CreateIncomeDto {
  categoryId: number;
  accountId: number;
  amount: number;
  incomeDate: Date;
  note: string;
}

export interface UpdateIncomeDto {
  categoryId: number;
  accountId: number;
  amount: number;
  incomeDate: Date;
  note: string;
}

export interface IncomeFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
  accountId?: number;
}
