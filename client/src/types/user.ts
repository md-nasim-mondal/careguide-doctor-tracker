export interface IUserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: string;
  isVerified: boolean;
  createdAt?: string;
}

export interface UserListResponse {
  users: IUserItem[];
  total: number;
}
