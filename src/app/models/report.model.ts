import { ChartData } from "./dashboard.model";
import { Expense } from "./expense.model";
import { Income } from "./income.model";

export interface ReportData {
  startDate: Date;
  endDate: Date;
  totalExpenses: number;
  totalIncomes: number;
  netSavings: number;
  expenseByCategory: ChartData[];
  incomeByCategory: ChartData[];
  expenses: Expense[];
  incomes: Income[];
}

export interface ExpenseSummary {
  totalExpenses: number;
  expenseByCategory: ChartData[];
  transactionCount: number;
  averageExpense: number;
}

export interface IncomeSummary {
  totalIncomes: number;
  incomeByCategory: ChartData[];
  transactionCount: number;
  averageIncome: number;
}

export interface MonthlyComparison {
  month: number;
  monthName: string;
  expenses: number;
  incomes: number;
  savings: number;
}
