import { IUser } from '../user/user.interface';

export interface ILoginPayload {
  email: string;
  password?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, 'password'>;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IResetPasswordPayload {
  id: string;
  code: string;
  newPassword: string;
}

export interface IForgotPasswordPayload {
  email: string;
}
