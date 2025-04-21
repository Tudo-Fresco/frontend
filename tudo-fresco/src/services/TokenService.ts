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
    return currentToken ?? localStorage.getItem('accessToken');
  }