import { StoreRequestModel } from '../models/StoreRequestModel';
import { ApiConnector } from '../utils/ApiConnector';

const api = new ApiConnector();

 export async function create(storeData: StoreRequestModel): Promise<void> {
    await api.post<void>('/store', JSON.stringify(storeData), {
      'Content-Type': 'application/json',
    });
  }