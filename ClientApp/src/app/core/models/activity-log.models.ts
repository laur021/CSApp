export interface Activitylog {
  id?: number;
  action: string;
  detail: string;
  ipAddress?: string;
  addedBy: string;
  dateAdded?: Date;
}
