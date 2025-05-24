import axios from 'axios';
import type { LoginCredentials, AuthResponse, ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('Token de acesso:', token ? 'Presente' : 'Ausente');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers da requisição:', config.headers);
    }
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error('Erro na resposta:', {
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers
    });

    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Tentando atualizar o token...');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('Nenhum token de atualização encontrado');
          throw new Error('No refresh token');
        }

        const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        console.log('Novo token de acesso obtido');

        localStorage.setItem('accessToken', access);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        console.log('Reenviando requisição original com novo token');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao atualizar token:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Iniciando login com:', { username: credentials.username });
      
      // Enviar dados no formato correto para o Django REST Framework
      const response = await api.post<AuthResponse>('/api/token/', {
        username: credentials.username,
        password: credentials.password
      });
      
      console.log('Resposta do login:', response.data);
      
      const { access, refresh } = response.data;
      
      if (!access) {
        throw new Error('Token de acesso não recebido');
      }

      // Configurar o token no header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Buscar dados do usuário
      const userResponse = await api.get('/api/v1/users/me/');
      
      const userData = {
        access,
        refresh,
        user: userResponse.data
      };
      
      console.log('Dados do usuário obtidos:', userData);
      return userData;
    } catch (error: any) {
      console.error('Erro detalhado no login:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers
      });
      
      if (error?.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      throw handleApiError(error);
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      console.log('[REGISTRO] Iniciando processo de registro');
      console.log('[REGISTRO] Dados do formulário:', { username, email });
      
      const response = await api.post('/api/v1/register/', { 
        username, 
        email, 
        password,
        password2: password
      });
      
      console.log('[REGISTRO] Resposta do servidor:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[REGISTRO] Erro detalhado:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers
      });
      
      if (error?.response?.data?.details) {
        const details = error.response.data.details;
        const errorMessages = [];
        
        // Processar erros de validação
        if (typeof details === 'object') {
          Object.entries(details).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => errorMessages.push(`${field}: ${msg}`));
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
        } else if (Array.isArray(details)) {
          errorMessages.push(...details);
        } else {
          errorMessages.push(details);
        }
        
        throw new Error(JSON.stringify(errorMessages));
      }
      
      throw handleApiError(error);
    }
  },

  logout: () => {
    console.log('Realizando logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  },

  refreshToken: async () => {
    try {
      console.log('Tentando atualizar token');
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        console.log('Nenhum token de atualização encontrado');
        throw new Error('No refresh token');
      }
      
      const response = await api.post('/api/token/refresh/', { refresh });
      console.log('Token atualizado com sucesso');
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
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      throw error;
    }
  },
};

export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || 'Erro na requisição',
      status: error.response?.status || 500,
    };
  }
  return {
    message: 'Erro desconhecido',
    status: 500,
  };
};

export default api; 