import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  CreditCard, 
  Gamepad2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  UserX, 
  Settings, 
  Link,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Signature,
  Percent,
  UserPlus
} from "lucide-react"
import { Poppins } from 'next/font/google'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

interface UserDetails {
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
  inviteCode: {
    code: string;
    commission_rate: string;
    total_invites: number;
    total_commission: string;
  } | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  invitedBy: string | null;
  wallet: Array<{
    balance: string;
    bonus: string;
    commission: string;
    rollover: string;
  }>;
  deposits: any[];
  withdraws: any[];
  games: any[];
  invitedUsers: any[];
  inviter: {
    id: string;
    username: string;
  } | null;
}

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState('');
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionError, setCommissionError] = useState('');

  const fetchUserDetails = async () => {
    if (!token || !id) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.raspapixoficial.com/v1/api/admin/users/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar detalhes do usuário');
      }

      setUserDetails(data.data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id, token]);

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isAdmin: boolean) => {
    return isAdmin 
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      : 'bg-green-500/10 text-green-400 border-green-500/20';
  };

  const getStatusText = (isAdmin: boolean) => {
    return isAdmin ? 'Admin' : 'Usuário';
  };

  const handleContact = () => {
    toast.info('Funcionalidade de contato em desenvolvimento');
  };

  const handleManageBalance = () => {
    toast.info('Funcionalidade de gerenciar saldo em desenvolvimento');
  };

  const handleLink = () => {
    toast.info('Funcionalidade de vincular em desenvolvimento');
  };

  const handleLocateIP = () => {
    toast.info('Funcionalidade de localizar IP em desenvolvimento');
  };

  const handleOpenCommissionModal = () => {
    setCommissionRate(userDetails?.inviteCode?.commission_rate || '');
    setCommissionError('');
    setIsCommissionModalOpen(true);
  };

  const handleCloseCommissionModal = () => {
    setIsCommissionModalOpen(false);
    setCommissionRate('');
    setCommissionError('');
  };

  const handleSaveCommission = async () => {
    if (!token || !userDetails) return;
    const rate = parseFloat(commissionRate.replace(',', '.'));
    if (isNaN(rate) || rate < 0) {
      setCommissionError('Informe uma comissão válida.');
      return;
    }
    setCommissionLoading(true);
    setCommissionError('');
    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/admin/affiliates/edit-commission', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userDetails.id,
          commission_rate: rate
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar comissão');
      }
      toast.success('Comissão atualizada com sucesso!');
      handleCloseCommissionModal();
      // Recarregar dados do usuário
      await fetchUserDetails();
    } catch (err: any) {
      setCommissionError(err.message);
      toast.error(err.message);
    } finally {
      setCommissionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={poppins.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
              <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                      Administração
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                      Usuários
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Carregando...</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className={poppins.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
              <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                      Administração
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                      Usuários
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Erro</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-400 text-lg mb-4">{error || 'Usuário não encontrado'}</p>
                <Button onClick={() => router.push('/v2/administrator/users')} className="bg-yellow-600 hover:bg-yellow-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Usuários
                </Button>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className={poppins.className}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                    Usuários
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">{userDetails.email}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Visualizar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/v2/administrator/users')}
                  className="text-neutral-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{userDetails.full_name}</h1>
                  <p className="text-neutral-400 text-sm">
                    Visualização de dados do usuário
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <Button onClick={handleContact} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Entrar em contato
                </Button>
                <Button onClick={handleManageBalance} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Saldo
                </Button>
              </div> */}
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="bg-neutral-800 border-neutral-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-yellow-400" />
                  Informações do Usuário
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">Usuário</p>
                      <p className="text-white font-medium">{userDetails.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">E-mail</p>
                      <p className="text-white font-medium">{userDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">Telefone</p>
                      <p className="text-white font-medium">{userDetails.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">Criado em</p>
                      <p className="text-white font-medium">{formatDate(userDetails.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Signature className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">Documento</p>
                      <p className="text-white font-medium">{formatCPF(userDetails.cpf)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link className="w-4 h-4 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-neutral-400 text-sm">Convidado por</p>
                      <p className="text-white font-medium">{userDetails.inviter?.username || 'Ninguém'}</p>
                    </div>
                    <Button onClick={handleLink} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      <Link className="w-4 h-4" />
                      Vincular
                    </Button>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-neutral-400 text-sm">Último IP</p>
                      <p className="text-white font-medium">127.0.0.1</p>
                    </div>
                    <Button onClick={handleLocateIP} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      Localizar
                    </Button>
                  </div> */}
                </div>
              </Card>

              {/* Wallet Information */}
              <Card className="bg-neutral-800 border-neutral-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neutral-400" />
                  Carteira
                </h3>
                
                {/* Saldo Principal */}
                <div className="mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-neutral-300 text-sm font-medium">Saldo Disponível</span>
                  </div>
                  <p className="text-white font-bold text-3xl ml-11">
                    {formatCurrency(userDetails.wallet[0]?.balance || '0')}
                  </p>
                </div>
                
                {/* Sub-valores */}
                <div className="space-y-4">

                  <Separator />
                  <div className='flex items-center justify-between'>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-neutral-400" />
                        Afiliações
                    </h3>
                    {/* <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                        Mudar porcentagem
                    </Button> */}
                  </div>

                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">Total de Afiliados</p>
                      <p className="text-white font-medium">{userDetails.inviteCode?.total_invites || '0'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Percent className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-neutral-400 text-sm">% por Depósito Aprovado</p>
                      <div className="flex items-center gap-3">
                        <p className="text-white font-medium">{userDetails.inviteCode?.commission_rate || '0'}%</p>
                        <Button onClick={handleOpenCommissionModal} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Settings className="w-4 h-4" />
                          Mudar porcentagem
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-white text-sm">Comissão</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatCurrency(userDetails.inviteCode?.total_commission || '0')}
                    </span>
                  </div>
                  
                  
                </div>
              </Card>
            </div>

            {/* Metrics */}
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-400" />
                Métricas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(userDetails.total_deposit)}
                  </p>
                  <p className="text-neutral-400 text-sm">Total Depositado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(userDetails.total_withdraw)}
                  </p>
                  <p className="text-neutral-400 text-sm">Total Retirado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency('0')}
                  </p>
                  <p className="text-neutral-400 text-sm">Total Gasto</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency((parseFloat(userDetails.total_deposit) - parseFloat(userDetails.total_withdraw)).toString())}
                  </p>
                  <p className="text-neutral-400 text-sm">Lucro</p>
                </div>
              </div>
            </Card>

            {/* Activity Tabs */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <Tabs defaultValue="deposits" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-neutral-700">
                    <TabsTrigger value="deposits" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                      Depósitos
                    </TabsTrigger>
                    <TabsTrigger value="withdraws" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                      Saques
                    </TabsTrigger>
                    <TabsTrigger value="games" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                      Jogadas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="deposits" className="mt-6">
                    {/* <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          placeholder="Pesquisar"
                          className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
                        />
                      </div>
                      <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                        <Badge className="ml-2 bg-yellow-600 text-white">{userDetails.deposits.length}</Badge>
                      </Button>
                    </div> */}
                    {userDetails.deposits.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-neutral-400 text-sm">Sem registros</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userDetails.deposits.map((deposit) => (
                          <div key={deposit.id} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Depósito PIX</p>
                                <p className="text-neutral-400 text-sm">{formatDate(deposit.created_at)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">{formatCurrency(deposit.amount)}</p>
                              <p className={`text-sm ${deposit.status ? 'text-green-400' : 'text-yellow-400'}`}>
                                {deposit.status ? 'Aprovado' : 'Pendente'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="withdraws" className="mt-6">
                    {/* <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          placeholder="Pesquisar"
                          className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
                        />
                      </div>
                      <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                        <Badge className="ml-2 bg-yellow-600 text-white">{userDetails.withdraws.length}</Badge>
                      </Button>
                    </div> */}
                    {userDetails.withdraws.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-neutral-400 text-sm">Sem registros</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userDetails.withdraws.map((withdraw) => (
                          <div key={withdraw.id} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Saque PIX</p>
                                <p className="text-neutral-400 text-sm">{formatDate(withdraw.created_at)}</p>
                                {withdraw.metadata?.rejection_reason && (
                                  <p className="text-red-400 text-xs">Motivo: {withdraw.metadata.rejection_reason}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">{formatCurrency(withdraw.amount)}</p>
                              <p className={`text-sm ${withdraw.status ? 'text-green-400' : withdraw.metadata?.rejected_at ? 'text-red-400' : 'text-yellow-400'}`}>
                                {withdraw.status ? 'Aprovado' : withdraw.metadata?.rejected_at ? 'Rejeitado' : 'Pendente'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="games" className="mt-6">
                    {/* <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          placeholder="Pesquisar"
                          className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
                        />
                      </div>
                      <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                        <Badge className="ml-2 bg-yellow-600 text-white">{userDetails.games.length}</Badge>
                      </Button>
                    </div> */}
                    {userDetails.games.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-neutral-400 text-sm">Sem registros</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userDetails.games.map((game) => (
                          <div key={game.id} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Jogada #{game.id.substring(0, 8)}</p>
                                <p className="text-neutral-400 text-sm">{formatDate(game.created_at)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                                {game.won ? 'Vitória' : 'Derrota'}
                              </p>
                              {game.prize && (
                                <p className="text-white text-sm">{formatCurrency(game.prize)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Modal de Alterar Comissão */}
      <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
        <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-400" />
              Alterar Comissão
            </DialogTitle>
          </DialogHeader>
          
          {commissionError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{commissionError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate" className="text-neutral-300">Nova porcentagem (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Ex: 5 para 5%"
                disabled={commissionLoading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseCommissionModal}
              className="flex-1 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
              disabled={commissionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCommission}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={commissionLoading}
            >
              {commissionLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
