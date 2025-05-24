export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
  user?: User;
  detail?: string;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, any>;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: number;
  category_name?: string;
  type: 'income' | 'expense';
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  recent_transactions: Transaction[];
}

export interface UserProfile {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  birth_date?: string;
  profile_picture?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
} 