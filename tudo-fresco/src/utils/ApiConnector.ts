import {getToken} from '../services/TokenService'
import { EnvManager } from './EnvManager';

export class ApiConnector {
  private readonly baseUrl = EnvManager.getEnvVariable('VITE_API_BASE_URL');
  private useAuth = true;

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? 'Something went wrong');
    }
    return data.payload as T;
  }

  private addAuthorizationHeader(headers: HeadersInit = {}): HeadersInit {
    if (this.useAuth){
        const token = getToken();
        const authHeader: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        return {
          ...authHeader,
          ...headers,
        };
      }
      else{
        return headers
      }
    }

  public setUseAuthorization(use: boolean): undefined {
    this.useAuth = use
  }

  public async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.addAuthorizationHeader(headers),
    });
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    console.log(this.baseUrl)
    console.log('CHAMOU O POST ')
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
    return this.handleResponse<T>(response);
  }

  public async put<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
    return this.handleResponse<T>(response);
  }

  public async patch<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.addAuthorizationHeader(headers),
      body,
    });
    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string, headers: HeadersInit = {}, body?: BodyInit): Promise<T> {
    const options: RequestInit = {
      method: 'DELETE',
      headers: this.addAuthorizationHeader(headers),
    };
    if (body) {
      options.body = body;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    return this.handleResponse<T>(response);
  }
}
