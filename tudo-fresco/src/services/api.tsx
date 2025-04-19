// services/api.ts
export async function handleApiResponse<T>(response: Response): Promise<{ payload: T; message: string }> {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return {
      payload: data.payload,
      message: data.message,
    };
  }
  