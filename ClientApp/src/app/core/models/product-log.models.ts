export interface ProductLog {
  id?: number;
  action: string;
  detail: string;
  addedBy: string;
  dateAdded?: string;
  productId: number;
}
