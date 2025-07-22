import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  History, 
  Bell,
  ChevronRight,
  ArrowDownLeft,
  Copy,
  Package,
  Users,
  DollarSign,
  UserCheck
} from 'lucide-react';
import Image from 'next/image';
import DepositModal from '@/components/deposit-modal';
import { getAppColor, getAppColorText, getAppColorBorder, getAppColorSvg, getAppGradient } from '@/lib/colors';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 rounded-lg group ${
        isActive 
          ? `${getAppColor()}/10 ${getAppColorText()} border-l-2 ${getAppColorBorder()}` 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
      }`}
    >
      <div className={`transition-colors ${
        isActive ? `${getAppColorText()}` : 'text-neutral-500 group-hover:text-white'
      }`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
        isActive ? `${getAppColorText()}` : 'text-neutral-600 group-hover:text-neutral-400'
      }`} />
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Função para lidar com cliques na sidebar
  const handleSidebarClick = (itemId: string) => {
    if (itemId === 'inventory') {
      router.push('/v1/profile/inventory');
    } else {
      setActiveSection(itemId);
    }
  };

  const [withdrawData, setWithdrawData] = useState({
    pixKey: '',
    keyType: 'cpf',
    amount: ''
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [financialHistory, setFinancialHistory] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [gameHistory, setGameHistory] = useState<any>(null);
  const [isLoadingGameHistory, setIsLoadingGameHistory] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState<any>(null);
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(false);

  // Função para formatar CPF
  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Função para copiar código de convite
  const copyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`https://raspa.ae?r=${code}`);
      toast.success('Link de convite copiado!');
    } catch (error) {
      toast.error('Erro ao copiar link de convite');
    }
  };

  // Função para extrair primeiro nome
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    return fullName.split(' ')[0];
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue) / 100).toFixed(2);
    return formattedValue;
  };

  // Função para validar chave PIX
  const validatePixKey = (key: string, type: string) => {
    if (!key) return false;
    
    switch (type) {
      case 'cpf':
        const cpfRegex = /^\d{11}$/;
        return cpfRegex.test(key.replace(/\D/g, ''));
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(key);
      case 'phone':
        const phoneRegex = /^\d{10,11}$/;
        return phoneRegex.test(key.replace(/\D/g, ''));
      case 'random':
        return key.length >= 32;
      default:
        return false;
    }
  };

  // Função para processar saque
  const handleWithdraw = async () => {
    if (!token || !profileData) {
      toast.error('Erro de autenticação');
      return;
    }

    const amount = parseFloat(withdrawData.amount);
    const availableBalance = parseFloat(profileData.wallet?.[0]?.balance || '0');

    // Validações
    if (!withdrawData.amount || amount <= 0) {
      toast.error('Digite um valor válido para saque');
      return;
    }

    if (amount < 10) {
      toast.error('Valor mínimo para saque é R$ 10,00');
      return;
    }

    if (amount > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    if (!withdrawData.pixKey) {
      toast.error('Digite sua chave PIX');
      return;
    }

    if (!validatePixKey(withdrawData.pixKey, withdrawData.keyType)) {
      toast.error('Chave PIX inválida para o tipo selecionado');
      return;
    }

    if (!profileData.cpf) {
      toast.error('CPF não encontrado no perfil');
      return;
    }

    setIsWithdrawing(true);

    try {
      const pixTypeMap = {
        cpf: 'CPF',
        email: 'EMAIL',
        phone: 'PHONE',
        random: 'RANDOM'
      };

      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/withdraw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          pix_key: withdrawData.pixKey,
          pix_type: pixTypeMap[withdrawData.keyType as keyof typeof pixTypeMap],
          document: profileData.cpf.replace(/\D/g, '')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar saque');
      }

      if (data.success) {
        toast.success(data.message || 'Solicitação de saque criada com sucesso!');
        
        // Limpar formulário
        setWithdrawData({
          pixKey: '',
          keyType: 'cpf',
          amount: ''
        });

        // Atualizar dados do perfil para refletir o novo saldo
        const updatedProfileData = {
          ...profileData,
          wallet: [{
            ...profileData.wallet[0],
            balance: data.data.wallet.balance
          }]
        };
        setProfileData(updatedProfileData);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar saque');
      console.error('Erro no saque:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Função para formatar valor no input
  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue || '0') / 100).toFixed(2);
    setWithdrawData(prev => ({ ...prev, amount: formattedValue }));
  };

  // Função para buscar histórico financeiro
  const fetchFinancialHistory = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }

    setIsLoadingHistory(true);

    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/financial-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar histórico');
      }

      if (data.success) {
        setFinancialHistory(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar histórico financeiro');
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter status em português
  const getStatusText = (status: boolean, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      return status ? 'Pago' : 'Pendente';
    } else {
      return status ? 'Processado' : 'Aguardando aprovação';
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-yellow-400';
  };

  // Função para buscar histórico de jogos
  const fetchGameHistory = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }

    setIsLoadingGameHistory(true);

    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/game-history?limit=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar histórico de jogos');
      }

      if (data.success) {
        setGameHistory(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar histórico de jogos');
      console.error('Erro ao buscar histórico de jogos:', error);
    } finally {
      setIsLoadingGameHistory(false);
    }
  };

  // Função para buscar dados dos afiliados
  const fetchAffiliatesData = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }

    setIsLoadingAffiliates(true);

    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/invited-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar dados dos afiliados');
      }

      if (data.success) {
        setAffiliatesData(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar dados dos afiliados');
      console.error('Erro ao buscar dados dos afiliados:', error);
    } finally {
      setIsLoadingAffiliates(false);
    }
  };

  // Função para obter status do jogo
  const getGameStatusText = (isWinner: boolean, status: string) => {
    if (status === 'COMPLETED') {
      return isWinner ? 'Ganhou' : 'Não ganhou';
    }
    return 'Em andamento';
  };

  // Função para obter cor do status do jogo
  const getGameStatusColor = (isWinner: boolean, status: string) => {
    if (status === 'COMPLETED') {
      return isWinner ? 'text-green-400' : 'text-red-400';
    }
    return 'text-yellow-400';
  };

  // Verificar autenticação e buscar dados do perfil
  useEffect(() => {
    // Aguardar o AuthContext terminar de carregar
    if (authLoading) {
      return;
    }

    // Se não há usuário ou token após o carregamento, redirecionar
    if (!user || !token) {
      router.push('/');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://api.raspapixoficial.com/v1/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar perfil');
        }

        if (data.success) {
          setProfileData(data.data);
        }
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar dados do perfil');
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, token, router, authLoading]);

  const sidebarItems = [
    { id: 'personal', icon: <User className="w-5 h-5" />, label: 'Informações Pessoais' },
    { id: 'inventory', icon: <Package className="w-5 h-5" />, label: 'Inventário' },
    { id: 'affiliates', icon: <Users className="w-5 h-5" />, label: 'Afiliados' },
    { id: 'withdraw', icon: <ArrowDownLeft className="w-5 h-5" />, label: 'Sacar Montante' },
    // { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Segurança' },
    { id: 'financial', icon: <CreditCard className="w-5 h-5" />, label: 'Histórico Financeiro' },
    { id: 'games', icon: <History className="w-5 h-5" />, label: 'Histórico de Jogos' },
    // { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Notificações' },
  ];

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-700">
                <div className={`w-16 h-16 ${getAppGradient()} rounded-full flex items-center justify-center overflow-hidden`}>
                  <Image
                    src="/memojis/male-4.png"
                    alt="memoji"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {isLoading ? 'Carregando...' : getFirstName(profileData?.full_name || user?.full_name || '')}
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    {isLoading ? 'Carregando...' : (profileData?.email || user?.email || 'email@exemplo.com')}
                  </p>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-8 p-4 bg-gradient-to-r from-neutral-500/10 to-neutral-600/10 rounded-lg border border-neutral-500/20">
                <p className={`${getAppColorText()} text-sm font-medium mb-1`}>Seu saldo</p>
                <p className="text-white text-2xl font-bold">
                  {isLoading ? 'Carregando...' : (
                    profileData?.wallet?.[0] ? 
                      `${profileData.wallet[0].symbol} ${parseFloat(profileData.wallet[0].balance).toFixed(2)}` : 
                      'R$ 0,00'
                  )}
                </p>
                <Button 
                  className={`${getAppGradient()} w-full mt-3 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20`}
                  onClick={() => setIsDepositModalOpen(true)}
                >
                  Depositar
                </Button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleSidebarClick(item.id)}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {activeSection === 'personal' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Informações Pessoais
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Gerencie suas informações pessoais e dados de contato
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-neutral-400">Carregando dados do perfil...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white font-medium">
                          Nome completo
                        </Label>
                        <Input
                          id="fullName"
                          value={profileData?.full_name || ''}
                          readOnly
                          className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white font-medium">
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData?.email || ''}
                          readOnly
                          className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-white font-medium">
                          CPF
                        </Label>
                        <Input
                          id="cpf"
                          value={formatCPF(profileData?.cpf || '')}
                          readOnly
                          className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white font-medium">
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          value={formatPhone(profileData?.phone || '')}
                          readOnly
                          className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white font-medium">
                          Nome de usuário
                        </Label>
                        <Input
                          id="username"
                          value={profileData?.username || ''}
                          readOnly
                          className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inviteCode" className="text-white font-medium">
                          Link de convite
                        </Label>
                        <div className="relative">
                          <Input
                            id="inviteCode"
                            value={profileData?.inviteCode?.code || ''}
                            readOnly
                            className="bg-neutral-700/50 border-neutral-600 text-white placeholder:text-neutral-400 cursor-not-allowed pr-12"
                          />
                          {profileData?.inviteCode?.code && (
                            <button
                              onClick={() => copyInviteCode(profileData.inviteCode.code)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 rounded hover:bg-neutral-600"
                              title="Copiar link de convite"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'withdraw' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Sacar Montante
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Realize saques para sua conta PIX de forma rápida e segura
                    </p>
                  </div>

                  {/* Saldo Atual */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium mb-1">Saldo disponível para saque</p>
                    <p className="text-white text-3xl font-bold">
                      {isLoading ? 'Carregando...' : (
                        profileData?.wallet?.[0] ? 
                          `${profileData.wallet[0].symbol} ${parseFloat(profileData.wallet[0].balance).toFixed(2)}` : 
                          'R$ 0,00'
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label htmlFor="keyType" className="text-white font-medium">
                         Tipo de chave PIX
                       </Label>
                       <Select value={withdrawData.keyType} onValueChange={(value) => setWithdrawData(prev => ({ ...prev, keyType: value }))}>
                         <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500 focus:ring-neutral-500/20">
                           <SelectValue placeholder="Selecione o tipo de chave" />
                         </SelectTrigger>
                         <SelectContent className="bg-neutral-700 border-neutral-600">
                           <SelectItem value="cpf" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">CPF</SelectItem>
                           <SelectItem value="email" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">E-mail</SelectItem>
                           <SelectItem value="phone" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">Telefone</SelectItem>
                           <SelectItem value="random" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">Chave aleatória</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white font-medium">
                        Valor do saque
                      </Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="R$ 0,00"
                        value={withdrawData.amount ? `R$ ${withdrawData.amount}` : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                          handleAmountChange(value);
                        }}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-neutral-500/20"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="pixKey" className="text-white font-medium">
                        Chave PIX
                      </Label>
                      <Input
                        id="pixKey"
                        type="text"
                        placeholder="Digite sua chave PIX"
                        value={withdrawData.pixKey}
                        onChange={(e) => setWithdrawData(prev => ({ ...prev, pixKey: e.target.value }))}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-neutral-500/20"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={handleWithdraw}
                        disabled={isWithdrawing || isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDownLeft className="w-4 h-4 mr-2" />
                        {isWithdrawing ? 'Processando...' : 'Sacar'}
                      </Button>
                      <div className="text-sm text-neutral-400">
                        <p>• Saques são processados em até 1 hora útil</p>
                        <p>• Valor mínimo: R$ 10,00</p>
                        <p>• Sem taxas para saques PIX</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Segurança
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Gerencie suas configurações de segurança e privacidade
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Alterar Senha</h3>
                      <p className="text-neutral-400 text-sm mb-4">Mantenha sua conta segura com uma senha forte</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Alterar Senha
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Autenticação de Dois Fatores</h3>
                      <p className="text-neutral-400 text-sm mb-4">Adicione uma camada extra de segurança à sua conta</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Configurar 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'financial' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Histórico Financeiro
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Visualize suas transações e movimentações financeiras
                    </p>
                  </div>

                  {!financialHistory ? (
                    <div className="text-center py-8">
                      <Button 
                        onClick={fetchFinancialHistory}
                        disabled={isLoadingHistory}
                        className={`${getAppGradient()} text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20`}
                      >
                        {isLoadingHistory ? 'Carregando...' : 'Carregar Histórico'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Resumo Financeiro */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                          <p className="text-green-400 text-sm font-medium mb-1">Total Depositado</p>
                          <p className="text-white text-xl font-bold">R$ {parseFloat(financialHistory.summary.total_deposits).toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg border border-red-500/20">
                          <p className="text-red-400 text-sm font-medium mb-1">Total Sacado</p>
                          <p className="text-white text-xl font-bold">R$ {parseFloat(financialHistory.summary.total_withdraws).toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                          <p className="text-yellow-400 text-sm font-medium mb-1">Saques Pendentes</p>
                          <p className="text-white text-xl font-bold">R$ {parseFloat(financialHistory.summary.pending_withdraws).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Depósitos */}
                      {financialHistory.deposits && financialHistory.deposits.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <ArrowDownLeft className="w-5 h-5 text-green-400 rotate-180" />
                            Depósitos
                          </h3>
                          <div className="space-y-3">
                            {financialHistory.deposits.map((deposit: any) => (
                              <div key={deposit.id} className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <ArrowDownLeft className="w-4 h-4 text-green-400 rotate-180" />
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{deposit.symbol} {parseFloat(deposit.amount).toFixed(2)}</p>
                                        <p className="text-neutral-400 text-sm">{deposit.payment_method}</p>
                                      </div>
                                    </div>
                                    <p className="text-neutral-400 text-sm">{formatDate(deposit.created_at)}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)} bg-current/10`}>
                                      {getStatusText(deposit.status, 'deposit')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Saques */}
                      {financialHistory.withdraws && financialHistory.withdraws.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <ArrowDownLeft className="w-5 h-5 text-red-400" />
                            Saques
                          </h3>
                          <div className="space-y-3">
                            {financialHistory.withdraws.map((withdraw: any) => (
                              <div key={withdraw.id} className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <ArrowDownLeft className="w-4 h-4 text-red-400" />
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{withdraw.symbol} {parseFloat(withdraw.amount).toFixed(2)}</p>
                                        <p className="text-neutral-400 text-sm">{withdraw.payment_method} • {withdraw.pix_type}</p>
                                      </div>
                                    </div>
                                    <div className="text-neutral-400 text-sm space-y-1">
                                      <p>Chave PIX: {withdraw.pix_key}</p>
                                      <p>{formatDate(withdraw.created_at)}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)} bg-current/10`}>
                                      {getStatusText(withdraw.status, 'withdraw')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Botão para recarregar */}
                      <div className="text-center pt-4">
                        <Button 
                          onClick={fetchFinancialHistory}
                          disabled={isLoadingHistory}
                          variant="outline"
                          className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                        >
                          {isLoadingHistory ? 'Carregando...' : 'Atualizar Histórico'}
                        </Button>
                      </div>

                      {/* Mensagem quando não há transações */}
                      {(!financialHistory.deposits || financialHistory.deposits.length === 0) && 
                       (!financialHistory.withdraws || financialHistory.withdraws.length === 0) && (
                        <div className="text-center py-12">
                          <CreditCard className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                          <p className="text-neutral-400 text-lg mb-2">Nenhuma transação encontrada</p>
                          <p className="text-neutral-500 text-sm">Suas transações aparecerão aqui quando você realizar depósitos ou saques</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'games' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Histórico de Jogos
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Visualize seu histórico de jogos e resultados
                    </p>
                  </div>

                  {!gameHistory ? (
                    <div className="text-center py-12">
                      <Button 
                        onClick={fetchGameHistory}
                        disabled={isLoadingGameHistory}
                        className={`${getAppGradient()} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20`}
                      >
                        {isLoadingGameHistory ? 'Carregando...' : 'Carregar Histórico de Jogos'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {gameHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <History className="w-16 h-16 mx-auto mb-4 text-neutral-500" />
                          <p className="text-neutral-400">Nenhum jogo encontrado</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Últimos 10 Jogos</h3>
                          
                          <div className="space-y-3">
                            {gameHistory.map((game: any) => (
                              <div key={game.id} className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="text-white font-medium">{game.scratchCard.name}</h4>
                                      <span className={`text-sm font-medium ${
                                        getGameStatusColor(game.is_winner, game.status)
                                      }`}>
                                        {getGameStatusText(game.is_winner, game.status)}
                                      </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <p className="text-neutral-400">Valor do jogo</p>
                                        <p className="text-white font-medium">R$ {parseFloat(game.scratchCard.price).toFixed(2)}</p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-neutral-400">Valor ganho</p>
                                        <p className={`font-medium ${
                                          parseFloat(game.amount_won) > 0 ? 'text-green-400' : 'text-neutral-400'
                                        }`}>
                                          R$ {parseFloat(game.amount_won).toFixed(2)}
                                        </p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-neutral-400">Tipo de prêmio</p>
                                        <p className="text-white">{game.prize_type || 'Nenhum'}</p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-neutral-400">Data do jogo</p>
                                        <p className="text-white">{formatDate(game.played_at)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'affiliates' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Afiliados
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Gerencie seus afiliados e acompanhe suas comissões
                    </p>
                  </div>

                  {!affiliatesData ? (
                    <div className="text-center py-12">
                      <Button 
                        onClick={fetchAffiliatesData}
                        disabled={isLoadingAffiliates}
                        className={`${getAppGradient()} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-neutral-400/20`}
                      >
                        {isLoadingAffiliates ? 'Carregando...' : 'Carregar Dados de Afiliados'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Estatísticas dos Afiliados */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 p-6 rounded-lg border border-yellow-400/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-white font-semibold">Total de Convites</h3>
                          </div>
                          <p className="text-2xl font-bold text-yellow-400">{affiliatesData.stats.total_invites}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-lg border border-green-400/20">
                          <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="w-6 h-6 text-green-400" />
                            <h3 className="text-white font-semibold">Total de Comissões</h3>
                          </div>
                          <p className="text-2xl font-bold text-green-400">R$ {parseFloat(affiliatesData.stats.total_commission).toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-lg border border-purple-400/20">
                          <div className="flex items-center gap-3 mb-2">
                            <UserCheck className="w-6 h-6 text-purple-400" />
                            <h3 className="text-white font-semibold">Convites Ativos</h3>
                          </div>
                          <p className="text-2xl font-bold text-purple-400">{affiliatesData.stats.active_invites}</p>
                        </div>
                      </div>

                      {/* Lista de Usuários Convidados */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-yellow-400" />
                          Usuários Convidados
                        </h3>
                        
                        {affiliatesData.invitedUsers.length === 0 ? (
                          <div className="text-center py-12">
                            <Users className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-400 text-lg mb-2">Nenhum usuário convidado</p>
                            <p className="text-neutral-500 text-sm">Convide amigos para começar a ganhar comissões</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {affiliatesData.invitedUsers.map((user: any, index: number) => (
                              <div key={index} className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <Users className="w-4 h-4 text-yellow-400" />
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{user.name || 'Usuário'}</p>
                                        <p className="text-neutral-400 text-sm">{user.email || 'Email não disponível'}</p>
                                      </div>
                                    </div>
                                    <div className="text-neutral-400 text-sm space-y-1">
                                      <p>Data de cadastro: {user.created_at ? formatDate(user.created_at) : 'Não disponível'}</p>
                                      <p>Status: {user.status || 'Ativo'}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                      Ativo
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Botão para recarregar */}
                      <div className="text-center pt-4">
                        <Button 
                          onClick={fetchAffiliatesData}
                          disabled={isLoadingAffiliates}
                          variant="outline"
                          className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                        >
                          {isLoadingAffiliates ? 'Carregando...' : 'Atualizar Dados'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'notifications' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Notificações
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Configure suas preferências de notificação
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Notificações por Email</h3>
                      <p className="text-neutral-400 text-sm mb-4">Receba atualizações importantes por email</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Configurar
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Notificações Push</h3>
                      <p className="text-neutral-400 text-sm mb-4">Receba notificações em tempo real no navegador</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Ativar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        token={token}
        updateUser={updateUser}
      />
    </div>
  );
}