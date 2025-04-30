import AddressRequestModel from '../models/AddressRequestModel';
import { ApiConnector } from '../utils/ApiConnector';

const api = new ApiConnector();

 export async function create(addressData: AddressRequestModel): Promise<void> {
    await api.post<void>('/address', JSON.stringify(addressData), {
      'Content-Type': 'application/json',
    });
  }