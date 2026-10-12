import { JwtPayload } from "jsonwebtoken";
import { Role, IsActive } from "../modules/user/user.interface";

export interface IAuthUser extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  isActive: IsActive;
  isDeleted?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser;
    }
  }
}

