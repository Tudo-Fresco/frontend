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