import { TransactionLog } from './transaction-log.model';

export interface Transaction {
  id: number;
  transactionId: string;
  transactionType: string;
  mode?: number;
  customer: string;
  pickUpDate: string;
  takeOffDate: string;
  duration: number;
  // productId: number;
  productName: string;
  // descriptionId: number;
  descriptionName: string;
  remarks: string;
  repliedBy: string;
  status: string;
  addedBy: string;
  dateAdded: string;
}

export interface TransactionWithLogs {
  id: number;
  transactionId: string;
  transactionType: string;
  mode?: number;
  customer: string;
  pickUpDate: Date;
  takeOffDate: Date;
  duration: number;
  productName: string;
  descriptionName: string;
  remarks: string;
  repliedBy: string;
  status: string;
  addedBy: string;
  dateAdded: Date;
  transactionLogs: TransactionLog[];
}

export interface TransactionWrite {
  transactionId: string;
  transactionType: string;
  mode?: number;
  customer: string;
  pickUpDate: string;
  takeOffDate: string;
  duration: number;
  remarks: string;
  repliedBy: string;
  status: string;
  addedBy: string;
  dateAdded: string;
  descriptionId: number;
}
