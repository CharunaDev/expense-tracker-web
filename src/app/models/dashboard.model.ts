export interface DashboardData {
  totalExpenses: number;
  totalIncomes: number;
  currentBalance: number;
  currentMonthExpenses: number;
  recentTransactions: Transaction[];
  expenseByCategory: ChartData[];
  expenseByMonth: MonthlyData[];
}

export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  merchantName: string;
  note: string;
  categoryName: string;
  type: "expense" | "income";
  createdAt: Date;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
}
