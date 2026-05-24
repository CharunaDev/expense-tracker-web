import { Category } from "./category.model";

export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount: number;
  category?: Category;
}

export interface CreateBudgetDto {
  categoryId: number;
  month: number;
  year: number;
  budgetAmount: number;
}

export interface UpdateBudgetDto {
  budgetAmount: number;
}
