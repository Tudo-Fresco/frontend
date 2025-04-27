import { LoginResponse } from '../models/LoginResponse';
import { ApiConnector } from '../utils/ApiConnector';
import { setToken } from './TokenService';

const api = new ApiConnector();

export async function login(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  api.setUseAuthorization(false);
  const loginResponse = await api.post<LoginResponse>(
    '/auth/login',
    formData.toString(),
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  );
  api.setUseAuthorization(true);
  setToken(loginResponse.accessToken);
  return loginResponse;
}

export function logout(): undefined {
  setToken(null);
}

