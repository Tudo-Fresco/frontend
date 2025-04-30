import { UserAccess } from '../enums/UserAccess';
import { LoginResponse } from '../models/LoginResponse';
import { ApiConnector } from '../utils/ApiConnector';
import { setToken, decode_token } from './TokenService';

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
  setToken(loginResponse.access_token);
  return loginResponse;
}

export function logout(): void {
  setToken(null);
}

export function getUserRoles(): UserAccess {
  const tokenContent = decode_token();
  if (tokenContent) {
    return tokenContent.role;
  }
  return UserAccess.GUEST;
}

export function hasAccess(allowedRoles: UserAccess[]): boolean {
  const userRole = getUserRoles();
  return allowedRoles.includes(userRole);
}