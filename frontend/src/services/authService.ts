import { api } from './api';

export const authService = {
  async login(username: string, password: string) {
    try {
      const response = await api.post('/api/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Configurar o token no header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Buscar dados do usuário após o login
      const userResponse = await api.get('/api/v1/users/me/');

      return {
        access,
        refresh,
        user: userResponse.data
      };
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  async register(username: string, email: string, password: string) {
    try {
      const response = await api.post('/api/v1/register/', {
        username,
        email,
        password,
      });

      // Após o registro bem-sucedido, fazer login automaticamente
      return this.login(username, password);
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token');
    
    const response = await api.post('/api/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('accessToken', access);

    // Configurar o novo token no header do axios
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    // Buscar dados do usuário após atualizar o token
    const userResponse = await api.get('/api/v1/users/me/');

    return {
      access,
      user: userResponse.data
    };
  },
}; 