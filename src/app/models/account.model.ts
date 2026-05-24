export interface Account {
  id: number;
  userId: number;
  name: string;
  accountType: "cash" | "bank" | "card" | "wallet";
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export interface CreateAccountDto {
  name: string;
  accountType: "cash" | "bank" | "card" | "wallet";
  openingBalance: number;
}

export interface UpdateAccountDto {
  name: string;
  accountType: "cash" | "bank" | "card" | "wallet";
  openingBalance: number;
}
