export interface Count {
  emailCount: number;
  phoneCount: number;
  totalTransactions: number;
  totalEmailCount: number;
  totalPhoneCount: number;
}

export interface UserChart extends Count {
  user: string;
}

export interface ProductChart extends Count {
  productName: string;
}

export interface DescriptionChart extends Count {
  descriptionName: string;
}

export interface TransactionChart extends Count {
  transactionDate: string;
}
