import api from './api';
import type { UserProfile } from '../types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/api/v1/users/me/profile/');
    return response.data;
  },

  async updateProfile(formData: FormData): Promise<UserProfile> {
    const response = await api.patch('/api/v1/users/me/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 