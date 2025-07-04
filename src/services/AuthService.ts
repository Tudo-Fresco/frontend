import { UserAccess } from '../enums/UserAccess';
import { LoginResponse } from '../models/LoginResponse';
import { ApiConnector } from '../utils/ApiConnector';
import { setToken, decodeToken, isTokenExpired } from './TokenService';

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
  const tokenContent = decodeToken();
  if (tokenContent) {
    return tokenContent.role;
  }
  return UserAccess.GUEST;
}

export function hasAccess(allowedRoles: UserAccess[]): boolean {
  const userRole = getUserRoles();
  return allowedRoles.includes(userRole);
}

export function getUserId(): string | null {
  const tokenContent = decodeToken();
  if (tokenContent) {
    return tokenContent.sub;
  }
  return null;
}


export function token_is_valid(): boolean {
  const token = decodeToken();
  const isValid: boolean = !! token && !isTokenExpired();
  return isValid;
}