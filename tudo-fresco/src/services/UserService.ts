import { ApiConnector } from '../utils/ApiConnector';
import { UserRequestModel } from '../models/UserRequestModel';

const api = new ApiConnector();

 export async function signUp(userData: UserRequestModel): Promise<void> {
    api.setUseAuthorization(false);
    await api.post<void>('/user/sign-up', JSON.stringify(userData), {
      'Content-Type': 'application/json',
    });
    api.setUseAuthorization(true);
  }
