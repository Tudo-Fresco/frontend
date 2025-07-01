import { UserAccess } from "../enums/UserAccess";
import { TokenContent } from "../models/TokenContent";

let currentToken: string | null = null;

export function setToken(token: string | null) {
    currentToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
  
export function getToken(): string | null {
    if (isTokenExpired()){
      return null;
    }
    return currentToken ?? localStorage.getItem('accessToken');
}

export function decodeToken(): TokenContent | null {
  const token = getToken();
  if (!token) {
      return null;
  }

  try {
      const parts = token.split('.');
      if (parts.length !== 3) {
          throw new Error('Invalid JWT format');
      }
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      const payloadObj = JSON.parse(decoded);
      if (
          typeof payloadObj.sub !== 'string' ||
          !Object.values(UserAccess).includes(payloadObj.role) ||
          typeof payloadObj.exp !== 'number'
      ) {
          throw new Error('Invalid JWT payload structure');
      }
      return {
          sub: payloadObj.sub,
          role: payloadObj.role as UserAccess,
          exp: payloadObj.exp
      };
  } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
  }
}

export function isTokenExpired(): boolean {
    const tokenContent = decodeToken();
    if (!tokenContent) return true;
  
    const now = new Date().getTime();
    const expiration = tokenContent.exp * 1000;
  
    return expiration <= now;
  }
