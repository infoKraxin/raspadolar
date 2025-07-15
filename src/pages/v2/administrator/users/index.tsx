import { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Edit, Trash2, Users, UserPlus, ChevronLeft, ChevronRight, Eye, X, Phone, Calendar, CreditCard, TrendingUp, TrendingDown, Gamepad2, UserCheck, Settings, UserX, UserCheck2 } from "lucide-react"
import { Poppins } from 'next/font/google'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

interface User {
  id: string;
  username: string;
  email: string;
  cpf: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallet: Array<{
    balance: string;
  }>;
  _count: {
    deposits: number;
    withdraws: number;
    games: number;
    invitedUsers: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  invitedBy: string | null;
  wallet: Array<{
    balance: string;
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

export default function UsersPage() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    balance: '',
    is_active: true
  });

  const fetchUsers = async (page: number = 1, search: string = '') => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.raspa.ae/v1/api/admin/users?page=${page}&limit=20&search=${encodeURIComponent(search)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar usuários');
      }

      setUsers(data.data.users);
      setPagination(data.data.pagination);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, [token]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setEditForm({
        username: user.username,
        email: user.email,
        balance: user.wallet[0]?.balance || '0',
        is_active: user.is_active
      });
      setIsEditModalOpen(true);
      setEditError('');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `https://api.raspa.ae/v1/api/admin/users/${userId}/toggle-status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': '/',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao alterar status do usuário');
      }

      // Atualizar a lista de usuários
      await fetchUsers(pagination.page, searchTerm);
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchTerm);
  };

  const fetchUserDetails = async (userId: string) => {
    if (!token) return;
    
    setDetailsLoading(true);
    setDetailsError('');
    try {
      const response = await fetch(
        `https://api.raspa.ae/v1/api/admin/users/${userId}`,
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
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
    fetchUserDetails(userId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setUserDetails(null);
    setDetailsError('');
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditForm({
      username: '',
      email: '',
      balance: '',
      is_active: true
    });
    setEditError('');
  };

  const handleEditFormChange = (field: string, value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateUser = async () => {
    if (!token || !editingUser) return;
    
    setEditLoading(true);
    setEditError('');
    
    try {
      const response = await fetch(
        `https://api.raspa.ae/v1/api/admin/users/${editingUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: editForm.username,
            email: editForm.email,
            balance: parseFloat(editForm.balance),
            is_active: editForm.is_active
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar usuário');
      }

      // Atualizar a lista de usuários
      await fetchUsers(pagination.page, searchTerm);
      
      // Fechar modal
      handleCloseEditModal();
      
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (isAdmin: boolean) => {
    return isAdmin 
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      : 'bg-green-500/10 text-green-400 border-green-500/20';
  };

  const getStatusText = (isAdmin: boolean) => {
    return isAdmin ? 'Admin' : 'Usuário';
  };

  return (
    <div className={poppins.className}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-neutral-600"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Usuários</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Usuários</h1>
                  <p className="text-neutral-400 text-sm">Total de {pagination.total} usuários cadastrados</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            {/* Search Section */}
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Buscar por nome, CPF, telefone ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                  Filtros
                </Button>
              </div>
            </Card>

            {/* Users Table */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-white">Lista de Usuários</h3>
                <p className="text-neutral-400 text-sm">
                  Mostrando {users.length} de {pagination.total} usuários (Página {pagination.page} de {pagination.pages})
                </p>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="p-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto p-6">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-700 hover:bg-neutral-700/50">
                        <TableHead className="text-neutral-300 font-medium w-[60px]">ID</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[120px]">Nome</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[100px]">Username</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[140px]">Email</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[100px]">CPF</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[80px]">Saldo</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[70px]">Dep.</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[60px]">Saq.</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[60px]">Jogos</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[70px]">Conv.</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[60px]">Tipo</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[60px]">Ativo</TableHead>
                        <TableHead className="text-neutral-300 font-medium w-[80px]">Cadastro</TableHead>
                        <TableHead className="text-neutral-300 font-medium text-right w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {!loading && !error && users.map((user) => (
                      <TableRow key={user.id} className="border-neutral-700 hover:bg-neutral-700/30">
                        <TableCell className="text-neutral-400 font-mono text-xs">
                          {user.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-white font-medium">{user.full_name}</TableCell>
                        <TableCell className="text-neutral-300">{user.username}</TableCell>
                        <TableCell className="text-neutral-300">{user.email}</TableCell>
                        <TableCell className="text-neutral-300">{formatCPF(user.cpf)}</TableCell>
                        <TableCell className="text-white font-medium">
                          {formatCurrency(user.wallet[0]?.balance || '0')}
                        </TableCell>
                        <TableCell className="text-green-400">{user._count.deposits}</TableCell>
                        <TableCell className="text-red-400">{user._count.withdraws}</TableCell>
                        <TableCell className="text-blue-400 font-medium">{user._count.games}</TableCell>
                        <TableCell className="text-purple-400">{user._count.invitedUsers}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.is_admin)}>
                            {getStatusText(user.is_admin)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-neutral-300 text-xs">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(user.id)}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user.id)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, user.is_active)}
                              className={user.is_active 
                                ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                                : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              }
                              title={user.is_active ? 'Desativar usuário' : 'Ativar usuário'}
                            >
                              {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck2 className="w-4 h-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </div>
              
              {!loading && !error && users.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-neutral-400 text-sm">Tente ajustar os filtros de busca</p>
                </div>
              )}
              
              {/* Pagination */}
              {!loading && !error && pagination.pages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-neutral-700">
                  <div className="text-sm text-neutral-400">
                    Página {pagination.page} de {pagination.pages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 disabled:opacity-50"
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Modal de Detalhes do Usuário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Detalhes do Usuário
            </DialogTitle>
          </DialogHeader>
          
          {detailsLoading && (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          {detailsError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{detailsError}</p>
            </div>
          )}
          
          {userDetails && !detailsLoading && (
             <div className="space-y-4 sm:space-y-6">
               {/* Informações Básicas */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                 <Card className="bg-neutral-700 border-neutral-600 p-3 sm:p-4">
                   <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                     <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                     Informações Pessoais
                   </h3>
                  <div className="space-y-2 sm:space-y-3">
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Nome Completo</label>
                       <p className="text-white font-medium text-sm sm:text-base break-words">{userDetails.full_name}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Username</label>
                       <p className="text-white font-medium text-sm sm:text-base break-words">{userDetails.username}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Email</label>
                       <p className="text-white font-medium text-sm sm:text-base break-words">{userDetails.email}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">CPF</label>
                       <p className="text-white font-medium text-sm sm:text-base">{formatCPF(userDetails.cpf)}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Telefone</label>
                       <p className="text-white font-medium text-sm sm:text-base">{userDetails.phone || 'Não informado'}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Tipo de Usuário</label>
                       <Badge className={`${getStatusColor(userDetails.is_admin)} text-xs`}>
                         {getStatusText(userDetails.is_admin)}
                       </Badge>
                     </div>
                     {userDetails.inviter && (
                       <div>
                         <label className="text-neutral-400 text-xs sm:text-sm block">Convidado por</label>
                         <p className="text-white font-medium text-sm sm:text-base">{userDetails.inviter.username}</p>
                       </div>
                     )}
                   </div>
                </Card>
                
                <Card className="bg-neutral-700 border-neutral-600 p-3 sm:p-4">
                   <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                     <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                     Informações Financeiras
                   </h3>
                   <div className="space-y-2 sm:space-y-3">
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Saldo Atual</label>
                       <p className="text-white font-bold text-base sm:text-lg">
                         {formatCurrency(userDetails.wallet[0]?.balance || '0')}
                       </p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Total Depositado</label>
                       <p className="text-green-400 font-medium text-sm sm:text-base">
                         {formatCurrency(userDetails.total_deposit)}
                       </p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Total Sacado</label>
                       <p className="text-red-400 font-medium text-sm sm:text-base">
                         {formatCurrency(userDetails.total_withdraw)}
                       </p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Depósitos Realizados</label>
                       <p className="text-white font-medium text-sm sm:text-base">{userDetails.deposits.length}</p>
                     </div>
                     <div>
                       <label className="text-neutral-400 text-xs sm:text-sm block">Saques Realizados</label>
                       <p className="text-white font-medium text-sm sm:text-base">{userDetails.withdraws.length}</p>
                     </div>
                   </div>
                 </Card>
              </div>
              
              {/* Estatísticas de Jogos */}
              <Card className="bg-neutral-700 border-neutral-600 p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  Estatísticas de Jogos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{userDetails.total_scratchs}</p>
                    <p className="text-neutral-400 text-sm">Total de Jogos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{userDetails.total_wins}</p>
                    <p className="text-neutral-400 text-sm">Vitórias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{userDetails.total_losses}</p>
                    <p className="text-neutral-400 text-sm">Derrotas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{userDetails.invitedUsers.length}</p>
                    <p className="text-neutral-400 text-sm">Usuários Convidados</p>
                  </div>
                </div>
              </Card>
              
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição do Usuário */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Usuário
            </DialogTitle>
          </DialogHeader>
          
          {editError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{editError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-neutral-300">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => handleEditFormChange('username', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Digite o username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => handleEditFormChange('email', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Digite o email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="balance" className="text-neutral-300">Saldo</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={editForm.balance}
                onChange={(e) => handleEditFormChange('balance', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Digite o saldo"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => handleEditFormChange('is_active', checked)}
              />
              <Label htmlFor="is_active" className="text-neutral-300">Usuário Ativo</Label>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseEditModal}
              className="flex-1 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
              disabled={editLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={editLoading}
            >
              {editLoading ? (
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