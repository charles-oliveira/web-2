import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import type { User, LoginCredentials, AuthContextType, AuthResponse } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação inicial');
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.log('Nenhum token encontrado');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        console.log('Token encontrado, verificando validade');
        const response = await authService.refreshToken();
        console.log('Token atualizado:', response);
        
        if (response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          console.log('Usuário não encontrado na resposta');
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      console.log('Iniciando login com:', credentials.username);
      setIsLoading(true);
      
      const response = await authService.login(credentials);
      console.log('Resposta do login:', response);

      if (!response.access) {
        throw new Error('Token de acesso não recebido');
      }

      localStorage.setItem('accessToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        console.log('Login realizado com sucesso');
      } else {
        throw new Error('Dados do usuário não recebidos');
      }
    } catch (error: any) {
      console.error('Erro no login:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Realizando logout');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { useAuth }; 