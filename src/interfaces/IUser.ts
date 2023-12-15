import { DefaultUser } from "next-auth";
import { IRole } from "../constants/defaultRoles";
import { IProduct } from "./IProduct";

export interface IProductOnClient {
  id: string;
  productOnClientId: string;
  product: IProduct;
  clientId: string;
  warrantyFinalDate: string;
  orderNumber: string;
}

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
  products?: IProductOnClient[];
  role: IRole;
  password?: string;
}
