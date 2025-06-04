import AddressRequestModel from '../models/AddressRequestModel';
import AddressResponseModel from '../models/AddressResponseModel';
import { ApiConnector } from '../utils/ApiConnector';

const api = new ApiConnector();

export async function create(addressData: AddressRequestModel): Promise<AddressResponseModel> {
  const response = await api.post<AddressResponseModel>(
    '/address',
    JSON.stringify(addressData),
    {
      'Content-Type': 'application/json',
    }
  );
  return response;
}

export async function freshFill(cep: string): Promise<AddressResponseModel> {
  const cleanedCep = cep.replace(/\D/g, '');
  return await api.get<AddressResponseModel>(
    `/address/fresh-fill?cep=${cleanedCep}`,
    {
      'Content-Type': 'application/json',
    }
  );
}