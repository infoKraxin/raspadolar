import React, { useState, useEffect, useCallback } from 'react';
// As dependências Next.js (useRouter, Image) e aliases foram removidas/substituídas para compatibilidade.
import { X, Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; 
import RegistrationBonusModal from './RegistrationBonusModal';

// --- Substitutos para compatibilidade ---

// Simulação de getAppGradient (Tailwind - Cor de Exemplo)
const getAppGradient = () => "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700";
// Simulação de getAppColor (Tailwind - Cor de Exemplo)
const getAppColor = () => "bg-indigo-600"; 
// Simulação de useAuth/login
const mockLogin = (user: any, token: string) => {
  console.log(`User logged in: ${user.email}, Token: ${token.substring(0, 10)}...`);
  // Aqui você faria o login real na sua aplicação
};

// Componente simples de Checkbox
const SimpleCheckbox = ({ id, required = false, className = '' }: { id: string, required?: boolean, className?: string }) => (
    <input type="checkbox" id={id} required={required} className={`h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-indigo-600 ${className}`} />
);

// Componente simples de Button
const SimpleButton = ({ children, type = 'button', className = '', disabled = false, onClick }: any) => (
    <button
        type={type}
        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </button>
);

// Fim dos Substitutos

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // O onAuthSuccess é mantido, mas não será chamado diretamente por mockLogin
  onAuthSuccess?: (user: any, token: string) => void; 
  // Propriedade opcional para o código de referência, caso a URL não seja acessível.
  initialReferralCode?: string; 
}

const API_BASE_URL = "https://raspadinha-api.onrender.com";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialReferralCode }: AuthModalProps) {
  // Substituído 'useAuth().login' pela mockLogin, pois o contexto não pode ser resolvido.
  const login = mockLogin; 

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    cpf: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // ESTADO para controlar o Modal de Bônus
  const [showBonusModal, setShowBonusModal] = useState(false); 
  
  // Usamos a prop inicial como fallback, já que useRouter foi removido
  const [referralCode, setReferralCode] = useState(initialReferralCode || ''); 

  // Body scroll lock (Simplificado)
  useEffect(() => {
    if (isOpen || showBonusModal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [isOpen, showBonusModal]);


  // Se o Modal de Bônus estiver aberto, o AuthModal não deve ser renderizado
  if (!isOpen && !showBonusModal) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = numericValue;
      if (numericValue.length > 0) {
        formattedValue = numericValue.replace(/^(\d{2})(\d)/g, '($1) $2');
      }
      if (numericValue.length > 6) {
        formattedValue = formattedValue.replace(/^(\(\d{2}\)\s)(\d{5})(\d)/g, '$1$2-$3');
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else if (name === 'cpf') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = numericValue;
      if (numericValue.length > 3) {
        formattedValue = numericValue.replace(/^(\d{3})(\d)/g, '$1.$2');
      }
      if (numericValue.length > 6) {
        formattedValue = formattedValue.replace(/^(\d{3}\.\d{3})(\d)/g, '$1.$2');
      }
      if (numericValue.length > 9) {
        formattedValue = formattedValue.replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/g, '$1-$2');
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (err: any) {
      // Usando console.error em vez de toast para simplificar, já que 'sonner' pode não estar disponível
      console.error('Erro de autenticação:', err.message); 
      alert(`Erro: ${err.message || 'Ocorreu um erro. Tente novamente.'}`); // Usando alert como fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    // Implementação de Login... (mantida)
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    if (data.token && data.user) {
      login(data.user, data.token);
      console.log('Login realizado com sucesso!');
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      onClose();
    } else {
      throw new Error('Resposta inesperada do servidor após o login.');
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    const registerData = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone.replace(/\D/g, ''),
      document: formData.cpf.replace(/\D/g, ''),
      referralCode: referralCode
    };

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar conta');
    }

    if (data.token && data.user) {
      login(data.user, data.token);
      console.log('Conta criada com sucesso!');

      // Lógica para checar o bônus e encadear os modais
      // O backend DEVE retornar `bonus_disponivel: true` e `bonus_amount: 2000.00`
      const bonus_amount = data.bonus_amount || 2000.00; // Usando fallback

      if (data.bonus_disponivel) {
        // 1. Fecha o Modal de Autenticação
        onClose();
        // 2. Abre o Modal de Bônus APÓS um pequeno delay para a transição
        setTimeout(() => {
            setShowBonusModal(true);
        }, 100); 
      } else {
        // Se não houver bônus, apenas fecha o modal
        onClose();
      }

      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
    } else {
      throw new Error('Resposta inesperada do servidor após o registro.');
    }
  };

  // --- Renderização do Modal de Bônus ---
  if (showBonusModal) {
    return (
        <RegistrationBonusModal 
            isOpen={showBonusModal} 
            onClose={() => setShowBonusModal(false)}
            // Passa o valor do bônus, usando um valor padrão se a API não fornecer
            bonusAmount={2000.00} 
        />
    );
  }

  // Se o Modal de Bônus não estiver ativo, renderiza o Modal de Autenticação (se estiver aberto)
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-neutral-700">
        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          {/* Left Side - Banner Image */}
          <div className="hidden md:flex md:w-1/2 relative min-h-[500px]">
            {/* Img simples substituindo next/image */}
            <img
              src="https://placehold.co/400x500/0c0a09/ffffff?text=REGISTRO+PREMIADO"
              alt="Banner"
              className="object-cover object-center w-full h-full rounded-l-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 to-neutral-900/20" /> 
          </div>

          {/* Right Side - Forms */}
          <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col min-h-[400px] md:min-h-[500px] justify-between">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent mb-2">
                {activeTab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </h2>
              <p className="text-neutral-400 text-sm">
                {activeTab === 'login' 
                  ? 'Entre na sua conta e continue jogando' 
                  : 'Registre-se e comece a ganhar prêmios reais'
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 bg-neutral-800/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? `${getAppColor()} text-white shadow-lg`
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? `${getAppColor()} text-white shadow-lg`
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Registrar
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
              {activeTab === 'register' && (
                <>
                  {/* Name Field */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefone (ex: (11) 98765-4321)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={15}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* CPF Field */}
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      name="cpf"
                      placeholder="CPF (ex: 123.456.789-00)"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      maxLength={14}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password Field (only for register) */}
              {activeTab === 'register' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {/* Remember me / Forgot password */}
              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
                    <SimpleCheckbox id="remember" />
                    Lembrar de mim
                  </label>
                  <button
                    type="button"
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {/* Terms (only for register) */}
              {activeTab === 'register' && (
                <div className="flex items-start gap-2 text-sm">
                  <SimpleCheckbox id="terms" required className="mt-0.5" />
                  <label htmlFor="terms" className="text-neutral-400 cursor-pointer">
                    Concordo com os{' '}
                    <button type="button" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                      Termos de Uso
                    </button>
                    {' '}e{' '}
                    <button type="button" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                      Política de Privacidade
                    </button>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <SimpleButton
                type="submit"
                className={`w-full ${getAppGradient()} text-white py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    {activeTab === 'login' ? 'Entrando...' : 'Criando conta...'}
                  </div>
                ) : (
                  activeTab === 'login' ? 'Entrar' : 'Criar Conta'
                )}
              </SimpleButton>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-neutral-400">
              {activeTab === 'login' ? (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-white hover:text-white transition-colors font-medium"
                  >
                    Registre-se
                  </button>
                </p>
              ) : (
                <p>
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-white hover:text-white transition-colors font-medium"
                  >
                    Faça login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
