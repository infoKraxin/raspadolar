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
  UserCheck,
  Loader2,
  Percent
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
  const [gameHistory, setGameHistory] = useState<any[] | null>(null);
  const [isLoadingGameHistory, setIsLoadingGameHistory] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState<any>(null);
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(false);

  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

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

  const copyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`https://raspa.ae?r=${code}`);
      toast.success('Link de convite copiado!');
    } catch (error) {
      toast.error('Erro ao copiar link de convite');
    }
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    return fullName.split(' ')[0];
  };

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

  const handleWithdraw = async () => {
    if (!token || !profileData) {
      toast.error('Erro de autenticação');
      return;
    }

    const amount = parseFloat(withdrawData.amount);
    const availableBalance = parseFloat(profileData.wallet?.[0]?.balance || '0');

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

    setIsWithdrawing(true);

    try {
      const pixTypeMap = {
        cpf: 'CPF',
        email: 'EMAIL',
        phone: 'PHONE',
        random: 'RANDOM'
      };

      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/withdraw', {
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

        setWithdrawData({
          pixKey: '',
          keyType: 'cpf',
          amount: ''
        });

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

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue || '0') / 100).toFixed(2);
    setWithdrawData(prev => ({ ...prev, amount: formattedValue }));
  };

  const fetchFinancialHistory = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }
    setIsLoadingHistory(true);
    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/financial-history', {
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

const getStatusText = (status: string, type: 'deposit' | 'withdraw') => {
  if (type === 'deposit') {
    if (status === 'paid' || status === 'COMPLETED') {
      return 'Pago';
    }
    return 'Pendente';
  } else {
    if (status === 'processed') {
      return 'Processado';
    }
    return 'Aguardando aprovação';
  }
};

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-yellow-400';
  };

  const fetchGameHistory = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }
    setIsLoadingGameHistory(true);
    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/game-history?limit=10', {
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

  const fetchAffiliatesData = async () => {
    if (!token) {
      toast.error('Erro de autenticação');
      return;
    }
    setIsLoadingAffiliates(true);
    try {
     const response = await fetch('https://raspadinha-api.onrender.com/v1/api/affiliates/my-data', {
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

  const getGameStatusText = (isWinner: boolean, status: string) => {
    if (status === 'COMPLETED') {
      return isWinner ? 'Ganhou' : 'Não ganhou';
    }
    return 'Em andamento';
  };

  const getGameStatusColor = (isWinner: boolean, status: string) => {
    if (status === 'COMPLETED') {
      return isWinner ? 'text-green-400' : 'text-red-400';
    }
    return 'text-yellow-400';
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user || !token) {
      router.push('/');
      return;
    }
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/profile', {
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

  useEffect(() => {
    const section = router.query.section;
    if (typeof section === 'string') {
        if(section === 'inventory') {
            router.push('/v1/profile/inventory');
        } else {
            setActiveSection(section);
        }
    }
  }, [router.query.section, router]);

  useEffect(() => {
    if (activeSection === 'financial' && token) {
      fetchFinancialHistory();
    }
    if (activeSection === 'games' && token) {
      fetchGameHistory();
    }
    if (activeSection === 'affiliates' && token) {
      fetchAffiliatesData();
    }
  }, [activeSection, token]);

  const sidebarItems = [
    { id: 'personal', icon: <User className="w-5 h-5" />, label: 'Informações Pessoais' },
    { id: 'inventory', icon: <Package className="w-5 h-5" />, label: 'Inventário' },
    { id: 'affiliates', icon: <Users className="w-5 h-5" />, label: 'Afiliados' },
    { id: 'withdraw', icon: <ArrowDownLeft className="w-5 h-5" />, label: 'Sacar Montante' },
    { id: 'financial', icon: <CreditCard className="w-5 h-5" />, label: 'Histórico Financeiro' },
    { id: 'games', icon: <History className="w-5 h-5" />, label: 'Histórico de Jogos' },
  ];

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
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
              <div className="mb-8 p-4 bg-gradient-to-r from-neutral-500/10 to-neutral-600/10 rounded-lg border border-neutral-500/20">
                <p className={`${getAppColorText()} text-sm font-medium mb-1`}>Seu saldo</p>
                <p className="text-white text-2xl font-bold">
                    {isLoading ? 'Carregando...' : `R$ ${(typeof profileData?.balance === 'number') ? profileData.balance.toFixed(2).replace('.', ',') : '0,00'}`}
                </p>
                <Button
                  className={`${getAppGradient()} w-full mt-3 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20`}
                  onClick={() => setIsDepositModalOpen(true)}
                >
                  Depositar
                </Button>
              </div>
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
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium mb-1">Saldo disponível para saque</p>
                    <p className="text-white text-3xl font-bold">
                      {isLoading ? 'Carregando...' : `R$ ${(typeof profileData?.balance === 'number') ? profileData.balance.toFixed(2) : '0.00'}`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label htmlFor="keyType" className="text-white font-medium">Tipo de chave PIX</Label>
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
                      <Label htmlFor="amount" className="text-white font-medium">Valor do saque</Label>
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
                      <Label htmlFor="pixKey" className="text-white font-medium">Chave PIX</Label>
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

              {activeSection === 'financial' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">Histórico Financeiro</h2>
                    <p className="text-neutral-400 text-sm">Visualize suas transações e movimentações financeiras</p>
                  </div>
                  {isLoadingHistory ? (
                    <div className="text-center py-12">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                      </div>
                      <p className="text-neutral-400 mt-4">Carregando histórico financeiro...</p>
                    </div>
                  ) : !financialHistory || (financialHistory.deposits.length === 0 && financialHistory.withdraws.length === 0) ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400 text-lg mb-2">Nenhuma transação encontrada</p>
                      <p className="text-neutral-500 text-sm">Suas transações aparecerão aqui quando você realizar depósitos ou saques</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
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
                      {financialHistory.deposits && financialHistory.deposits.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><ArrowDownLeft className="w-5 h-5 text-green-400 rotate-180" />Depósitos</h3>
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
                      {financialHistory.withdraws && financialHistory.withdraws.length > 0 && (
                        <div>
                           <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><ArrowDownLeft className="w-5 h-5 text-red-400" />Saques</h3>
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
                  {isLoadingGameHistory ? (
                     <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" /></div>
                  ) : !gameHistory || gameHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400 text-lg mb-2">Nenhum jogo encontrado</p>
                      <p className="text-neutral-500 text-sm">Seu histórico de jogos aparecerá aqui.</p>
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
                                  {/* --- CORREÇÃO APLICADA --- */}
                                  <h4 className="text-white font-medium">{game.scratch_card_name}</h4>
                                  <span className={`text-sm font-medium ${getGameStatusColor(game.is_winner, game.status)}`}>
                                    {getGameStatusText(game.is_winner, game.status)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-neutral-400">Custo</p>
                                    {/* --- CORREÇÃO APLICADA --- */}
                                    <p className="text-white font-medium">R$ {parseFloat(game.price_paid).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-neutral-400">Prêmio</p>
                                    <p className={`font-medium ${parseFloat(game.amount_won) > 0 ? 'text-green-400' : 'text-neutral-400'}`}>
                                      R$ {parseFloat(game.amount_won).toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-neutral-400">Prêmio Ganhado</p>
                                    <p className="text-white">{game.prize_won_name || 'Nenhum'}</p>
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
                  {isLoadingAffiliates ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                        <p className="text-neutral-400 mt-4">Carregando dados de afiliados...</p>
                    </div>
                  ) : affiliatesData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-lg border border-blue-400/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Percent className="w-6 h-6 text-blue-400" />
                            <h3 className="text-white font-semibold">Sua Comissão</h3>
                          </div>
                          <p className="text-2xl font-bold text-blue-400">{affiliatesData.stats.commission_rate}%</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-yellow-400" />
                          Usuários Convidados
                        </h3>
                        {affiliatesData.invitedUsers.length === 0 ? (
                          <div className="text-center py-12">
                            <Users className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-400 text-lg mb-2">Nenhum usuário convidado</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {affiliatesData.invitedUsers.map((user: any, index: number) => (
                              <div key={index} className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-neutral-400 text-sm">{user.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-neutral-300 text-sm">Cadastro:</p>
                                    <p className="text-white text-sm">{formatDate(user.created_at)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-neutral-400 text-lg mb-2">Não foi possível carregar os dados de afiliado.</p>
                      <p className="text-neutral-500 text-sm mb-4">Tente novamente mais tarde.</p>
                      <Button
                          onClick={fetchAffiliatesData}
                          variant="outline"
                          className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                      >
                          Tentar Novamente
                      </Button>
                    </div>
                  )}
                  {/* Botão de atualizar dados dentro do bloco 'affiliates' */}
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
