import { LoginResponse } from '../models/LoginResponse';
import { ApiConnector } from '../utils/ApiConnector';

const api = new ApiConnector('http://localhost:8777');

export async function performLogin(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  const loginResponse = await api.post<LoginResponse>('/auth/login', formData.toString(), {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  return loginResponse;
}
