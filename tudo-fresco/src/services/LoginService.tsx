import { handleApiResponse } from './api';

export async function loginService(username: string, password: string) {
  const url = 'http://localhost:8777/auth/login';

  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const { payload, message } = await handleApiResponse<{
    access_token: string;
    token_type: string;
  }>(response);

  return {
    accessToken: payload.access_token,
    tokenType: payload.token_type,
    message,
  };
}
