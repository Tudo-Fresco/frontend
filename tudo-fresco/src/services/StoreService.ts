import { ApiConnector } from '../utils/ApiConnector';
import { StoreRequestModel } from '../models/StoreRequestModel';

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