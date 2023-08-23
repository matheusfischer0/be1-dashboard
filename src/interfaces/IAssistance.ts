export interface IAssistance {
  id: string;
  title: string;
  description: string;
  status: string;
  clientId?: string;
  productId?: string;
  productName?: string;
  createdBy?: string;
  createdAt?: Date;
}
