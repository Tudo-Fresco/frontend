import { ApiConnector } from '../utils/ApiConnector';
import { StoreRequestModel } from '../models/StoreRequestModel';
import { StoreResponseModel } from '../models/StoreResponseModel';

const api = new ApiConnector();

export async function create(storeData: StoreRequestModel): Promise<void> {
  await api.post<void>(
    '/store',
    JSON.stringify(storeData),
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function freshFill(cnpj: string): Promise<StoreResponseModel> {
  const cleanedCnpj = cnpj.replace(/\D/g, '');
  return await api.get<StoreResponseModel>(
    `/store/fresh-fill?cnpj=${cleanedCnpj}`,
    {
      'Content-Type': 'application/json',
    }
  );
}