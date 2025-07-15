import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  phone: string;
  cpf: string;
  username: string;
  full_name: string;
  is_admin: boolean;
  total_scratchs: number;
  total_wins: number;
  total_losses: number;
  total_deposit: string;
  total_withdraw: string;
  created_at: string;
  updated_at: string;
  wallet: {
    id: string;
    userId: string;
    balance: string;
    currency: string;
    symbol: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  }[];
  inviteCode: {
    id: string;
    userId: string;
    code: string;
    commission_rate: string;
    total_invites: number;
    total_commission: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados de autenticação salvos no localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;