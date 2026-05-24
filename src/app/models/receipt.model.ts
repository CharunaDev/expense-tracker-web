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

export interface ProcessReceiptDto {
  categoryId: number;
  accountId: number;
  note: string;
}
