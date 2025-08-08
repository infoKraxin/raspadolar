import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  phone: string;
  cpf: string;
  username: string;
  full_name: string;
  balance: number;
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
  
  // ===================================================================
  // ====== BLOCO DE CÓDIGO PARA ATUALIZAÇÃO SILENCIOSA DO SALDO ========
  // ===================================================================
  useEffect(() => {
    // Se não há usuário ou token, não faz nada
    if (!token || !user) return;

    // Inicia a verificação periódica a cada 7 segundos
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) return;

        const profileData = await response.json();
        
        if (profileData.success) {
          const newBalance = profileData.data.balance;

          // Compara o novo saldo com o saldo atual no estado
          if (newBalance !== user.balance) {
            // Se for diferente, atualiza o usuário silenciosamente
            updateUser(profileData.data);
            
            // Opcional: Se quiser a notificação CORRIGIDA (aparecendo só uma vez), 
            // remova as duas barras da linha do 'if' e do 'toast.success' abaixo.
            // if (newBalance > user.balance) {
            //   toast.success('Seu saldo foi atualizado!');
            // }
          }
        }
      } catch (error) {
        // Ignora erros para não poluir o console ou incomodar o usuário
      }
    }, 7000); // Verifica a cada 7 segundos

    // Limpa o intervalo para evitar problemas de performance quando o usuário deslogar
    return () => clearInterval(intervalId);

  }, [token, user]); // Roda o efeito se o token ou os dados do usuário mudarem
  // ===================================================================
  // =================== FIM DO BLOCO DE ATUALIZAÇÃO ===================
  // ===================================================================

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
