import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getAppColor, getAppGradient } from '@/lib/colors';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: any, token: string) => void;
}

// SUA URL DA API FOI COLADA AQUI!
const API_BASE_URL = "https://raspadinha-api.onrender.com";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // Será mapeado para 'username' no backend
    phone: '', // Agora enviado para o backend
    cpf: '' // Agora enviado para o backend como 'document'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      toast.error(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
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
      
      toast.success('Login realizado com sucesso!');
      
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

    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('r');
    
    // ATUALIZADO: Agora enviamos 'phone' e 'document' (mapeado de 'cpf') para o backend.
    const registerData: any = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone.replace(/\D/g, ''), // Envia apenas os números
      document: formData.cpf.replace(/\D/g, ''), // Mapeia 'cpf' para 'document' e envia apenas os números
    };

    if (inviteCode) {
      // Se você quiser usar um código de convite no futuro, o backend precisará ser adaptado.
      // registerData.invite_code = inviteCode;
    }

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
      
      toast.success('Conta criada com sucesso!');
      
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      
      onClose();
    } else {
        throw new Error('Resposta inesperada do servidor após o registro.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-neutral-700">
        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          {/* Left Side - Banner Image */}
          <div className="hidden md:flex md:w-1/2 relative min-h-[500px]">
            <Image
              src="/banner_modal.webp"
              alt="Banner"
              fill
              className="object-cover object-center"
              priority
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

                  {/* Phone Field (agora enviado ao backend) */}
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

                  {/* CPF Field (agora enviado ao backend como 'document') */}
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
                    <Checkbox id="remember" />
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
                  <Checkbox id="terms" required className="mt-0.5" />
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
              <Button
                type="submit"
                className={`w-full ${getAppGradient()} text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
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
              </Button>
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
  );
}
