import { Navigate, useLocation } from 'react-router-dom';
import type { ProtectedRouteProps } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log('Verificando autenticação:', {
      isAuthenticated,
      user,
      isLoading,
      path: location.pathname
    });
    
    // Aguarda o carregamento inicial da autenticação
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isAuthenticated, user, location, isLoading]);

  // Mostra loading enquanto verifica a autenticação
  if (isLoading || isChecking) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated || !user) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  console.log('Usuário autenticado, renderizando conteúdo protegido');
  return <>{children}</>;
}; 