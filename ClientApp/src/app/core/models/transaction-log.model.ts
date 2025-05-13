export interface TransactionLog {
  id?: number;
  action: string;
  detail: string;
  addedBy: string;
  dateAdded: string;
  transactionId: string;
}
