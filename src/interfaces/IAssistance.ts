import { IFile } from "./IFile";
import { IProduct } from "./IProduct";
import { IUser } from "./IUser";

export interface IAssistance {
  id: string;
  title: string;
  description: string;
  status: string;
  productId: string;
  productName: string;
  product: IProduct;
  files: IFile[];
  clientId: string;
  client: IUser;
  technicianId?: string;
  technician?: IUser;
  chatId?: string;
  locationId: string;
  location: Location;
  finishDocumentId?: string;
  observation?: string;
  consideration: string | null;
  createdBy?: string;
  createdAt?: string;
}
