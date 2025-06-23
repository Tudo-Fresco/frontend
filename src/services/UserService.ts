import { ApiConnector } from '../utils/ApiConnector';
import { UserRequestModel } from '../models/UserRequestModel';
import { UserResponseModel } from '../models/UserResponseModel';
import { getUserId } from './AuthService';
import { UserUpdateProfileRequestModel } from '../models/UserUpdateProfileRequestModel';

const api = new ApiConnector();

export async function signUp(userData: UserRequestModel): Promise<void> {
  api.setUseAuthorization(false);
  await api.post<void>('/user/sign-up', JSON.stringify(userData), {
    'Content-Type': 'application/json',
  });
  api.setUseAuthorization(true);
}

export async function getCurrentUser(): Promise<UserResponseModel> {
  return await api.get<UserResponseModel>(
    `/user/by-uuid/${getUserId()}`,
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function getSignedProfilePictureUrl(): Promise<string> {
  return await api.get<string>(
    `/user/signed-profile-picture`,
    {
      'Content-Type': 'application/json',
    }
  );
}

export async function uploadProfilePicture(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await api.post<void>('/user/profile-picture', formData);
}

export async function updateUserProfile(profileData: UserUpdateProfileRequestModel): Promise<void> {
  await api.put<void>(
    '/user/profile',
    JSON.stringify(profileData),
    {
      'Content-Type': 'application/json',
    }
  );
}