export interface LoginRequest {
  username: number;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  accessToken: string;
  expiresIn: number;
  role: string;
  team: string;
  status: string;
  fullName: string;
}
export interface Account {
  id?: number;
  fullName: string;
  username: string;
  password: string;
  role: string;
  team: string;
  status: string;
  addedBy?: string;
  dateAdded?: string;
}

export interface ResetPassword {
  newPassword: string;
}
