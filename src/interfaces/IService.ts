export interface IService {
  id: string;
  description: string;
  order?: number;
  createdAt?: Date;
  serviceOptions?: IServiceOption[];
}
export interface IServiceOption {
  id?: string;
  description: string;
  order: number;
  createdAt?: Date;
}
