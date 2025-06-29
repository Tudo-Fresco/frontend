import { getToken } from '../services/TokenService';
import { EnvManager } from './EnvManager';

export class ApiConnector {
  private readonly baseUrl = EnvManager.getEnvVariable('VITE_API_BASE_URL') ?? 'https://backend-632322610910.southamerica-east1.run.app';
  private useAuth = true;

  private addAuthorizationHeader(headers: HeadersInit = {}): HeadersInit {
    if (this.useAuth) {
      const token = getToken();
      const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      return {
        ...authHeader,
        ...headers,
      };
    } else {
      return headers;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      throw new Error(data?.message ?? 'Erro inesperado na requisição');
    }

    return data.payload as T;
  }

  public setUseAuthorization(use: boolean): undefined {
    this.useAuth = use;
  }

  private async fetchWithHandling<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
  
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Erro capturado no fetch:', err);
      if (err.name === 'AbortError') {
        throw new Error('A requisição demorou muito para responder. Verifique sua conexão.');
      } else if (err.name === 'TypeError') {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua internet.');
      }
      throw err;
    }
  }

  public async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    return this.fetchWithHandling<T>(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.addAuthorizationHeader(headers),
    });
  }

  public async post<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    if (body instanceof FormData) {
      const { 'Content-Type': _, ...restHeaders } = headers as Record<string, string>;
      headers = restHeaders;
    }
    return this.fetchWithHandling<T>(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
  }
  
  public async put<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    return this.fetchWithHandling<T>(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
  }

  public async patch<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    return this.fetchWithHandling<T>(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
  }

  public async delete<T>(endpoint: string, headers: HeadersInit = {}, body?: BodyInit): Promise<T> {
    const options: RequestInit = {
      method: 'DELETE',
      headers: this.addAuthorizationHeader(headers),
    };
    if (body) {
      options.body = body;
    }
    return this.fetchWithHandling<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
