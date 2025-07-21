import { useState } from 'react';
import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Lock,
  User,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Fazer chamada para a API de login
      const response = await fetch('https://api.raspapixoficial.com/v1/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na autenticação');
      }

      // Verificar se o usuário é administrador
      if (!data.data.user.is_admin) {
        setError('Acesso negado. Você não tem permissões de administrador.');
        return;
      }

      // Fazer login usando o contexto
      login(data.data.user, data.data.token);
      
      // Redirecionar para o dashboard administrativo
      router.push('/v2/administrator/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg flex items-center justify-center shadow-lg border border-neutral-500/30">
              <Shield className="w-10 h-10 text-neutral-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
            Painel Administrativo
          </h1>
          <p className="text-neutral-400 text-sm">
            Acesse o sistema de gerenciamento do seu sistema
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@heroigaming.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-yellow-500 focus:ring-yellow-500/20"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-yellow-500 focus:ring-yellow-500/20 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Acessar
                </div>
              )}
            </Button>
          </form>


        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-neutral-500 text-xs">
            Hero iGaming © 2025 | Todos os direitos reservados sem direito de divulgação do acesso administrador.
          </p>
        </div>
      </div>
    </div>
  );
}