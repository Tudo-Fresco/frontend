export class ApiConnector {
    private baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    private async handleResponse<T>(response: Response): Promise<T> {
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      return data.payload as T;
    }
  
    public async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });
  
      return this.handleResponse<T>(response);
    }
  
    public async post<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body,
      });
  
      return this.handleResponse<T>(response);
    }
  
    public async put<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body,
      });
  
      return this.handleResponse<T>(response);
    }
  
    public async patch<T>(endpoint: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body,
      });
  
      return this.handleResponse<T>(response);
    }
  
    public async delete<T>(endpoint: string, headers: HeadersInit = {}, body?: BodyInit): Promise<T> {
      const options: RequestInit = {
        method: 'DELETE',
        headers,
      };
  
      if (body) {
        options.body = body;
      }
  
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
  
      return this.handleResponse<T>(response);
    }
  }
  