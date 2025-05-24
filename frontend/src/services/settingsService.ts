import { api } from './api';

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  language: string;
  twoFactorAuth: boolean;
  dataSharing: boolean;
}

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>('/api/v1/settings/');
    return response.data;
  },

  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    const response = await api.put<UserSettings>('/api/v1/settings/', settings);
    return response.data;
  },
}; 