import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de autenticação aqui
    console.log('Form submitted:', formData);
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
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
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-lg'
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
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                      required
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
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                  required
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
                  className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
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
                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
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
                    className="text-blue-400 hover:text-blue-300 transition-colors"
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
                    <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Termos de Uso
                    </button>
                    {' '}e{' '}
                    <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Política de Privacidade
                    </button>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {activeTab === 'login' ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-neutral-400">
              {activeTab === 'login' ? (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Registre-se
                  </button>
                </p>
              ) : (
                <p>
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
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