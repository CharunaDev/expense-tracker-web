export interface Category {
  id: number;
  userId: number;
  name: string;
  type: "expense" | "income";
  isActive: boolean;
}

export interface CreateCategoryDto {
  name: string;
  type: "expense" | "income";
}

export interface UpdateCategoryDto {
  name: string;
  type: "expense" | "income";
}
