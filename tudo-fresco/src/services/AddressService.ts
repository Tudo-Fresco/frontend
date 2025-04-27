import AddressRequestModel from '../models/AddressRequestMode';
import { ApiConnector } from '../utils/ApiConnector';

const api = new ApiConnector();

 export async function create(addressData: AddressRequestModel): Promise<void> {
    await api.post<void>('/store', JSON.stringify(addressData), {
      'Content-Type': 'application/json',
    });
  }