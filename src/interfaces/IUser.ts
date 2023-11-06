import { DefaultUser } from "next-auth";
import { IRole } from "../constants/defaultRoles";

export interface IUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  cpf?: string;
  state?: string;
  city?: string;
  clients?: { id: string }[];
  phone?: string;
  role: IRole;
  password?: string;
}
