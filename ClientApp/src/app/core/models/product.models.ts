import { Description } from "./description.models";
import { ProductLog } from "./product-log.models";

export interface Product {
  id?: number;
  name: string;
  addedBy: string;
  dateAdded?: Date;
}

export interface ProductwithDescriptions {
  id?: number;
  name: string;
  addedBy: string;
  dateAdded?: Date;
  descriptions: Description[];
}

export interface ProductwithLogs {
  id?: number;
  name: string;
  addedBy: string;
  dateAdded?: Date;
  productLogs: ProductLog[];
}

export interface ProductDetails {
  id?: number;
  name: string;
  addedBy: string;
  dateAdded?: Date;
  descriptions: Description[];
  productLogs: ProductLog[];
}
