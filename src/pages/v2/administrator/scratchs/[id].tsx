import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Gift, DollarSign, Users, TrendingUp, Loader2, Eye, Calendar, Target, Percent, Edit, Settings } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

// Interfaces
interface Prize {
  id: string;
  scratchCardId: string;
  name: string;
  description: string;
  type: string;
  value: string;
  product_name: string | null;
  redemption_value: string | null;
  image_url: string | null;
  probability: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ScratchCard {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  is_active: boolean;
  target_rtp: string;
  current_rtp: string;
  total_revenue: string;
  total_payouts: string;
  total_games_played: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  prizes: Prize[];
}

interface ScratchCardResponse {
  success: boolean;
  message: string;
  data: ScratchCard;
}

// Funções de formatação
const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
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

const formatPercentage = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(1)}%`;
};

const fixImageUrl = (url: string | null) => {
  if (!url) return null;
  
  // Trocar raspa.ae por api.raspapixoficial.com
  let fixedUrl = url.replace('https://raspa.ae/', 'https://api.raspapixoficial.com/');
  
  // Remover 'prizes/' e 'scratchcards/' após 'uploads/'
  fixedUrl = fixedUrl.replace('/uploads/prizes/', '/uploads/');
  fixedUrl = fixedUrl.replace('/uploads/scratchcards/', '/uploads/');
  
  return fixedUrl;
};

export default function ScratchCardDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, isLoading: authLoading } = useAuth();
  const [scratchCard, setScratchCard] = useState<ScratchCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    target_rtp: '',
    is_active: true
  });

  const fetchScratchCard = async () => {
    if (!token || !id) {
      setError('Token de autenticação ou ID não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.raspapixoficial.com/v1/api/scratchcards/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError('Token inválido ou expirado');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: ScratchCardResponse = await response.json();
      setScratchCard(data.data);
    } catch (err) {
      console.error('Erro ao buscar raspadinha:', err);
      setError('Erro ao carregar detalhes da raspadinha');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token && id) {
      fetchScratchCard();
    } else if (!authLoading && !token) {
      setError('Usuário não autenticado');
      setLoading(false);
    }
  }, [token, authLoading, id]);

  const handleBack = () => {
    router.push('/v2/administrator/scratchs');
  };

  const handleEdit = () => {
    if (scratchCard) {
      setEditForm({
        name: scratchCard.name,
        description: scratchCard.description,
        price: scratchCard.price,
        target_rtp: scratchCard.target_rtp,
        is_active: scratchCard.is_active
      });
      setIsEditModalOpen(true);
      setEditError('');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({
      name: '',
      description: '',
      price: '',
      target_rtp: '',
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

  const handleUpdateScratchCard = async () => {
    if (!token || !scratchCard) return;
    
    setEditLoading(true);
    setEditError('');
    
    try {
      const response = await fetch(`https://api.raspapixoficial.com/v1/api/scratchcards/admin/${scratchCard.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          target_rtp: parseFloat(editForm.target_rtp),
          is_active: editForm.is_active
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar raspadinha');
      }

      toast.success('Raspadinha atualizada com sucesso!');
      handleCloseEditModal();
      await fetchScratchCard();
      
    } catch (err: any) {
      setEditError(err.message);
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getPrizeTypeColor = (type: string) => {
    switch (type) {
      case 'MONEY':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'PRODUCT':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  const getPrizeTypeName = (type: string) => {
    switch (type) {
      case 'MONEY':
        return 'Dinheiro';
      case 'PRODUCT':
        return 'Produto';
      default:
        return type;
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
                    <BreadcrumbLink href="/v2/administrator/scratchs" className="text-neutral-400 hover:text-white">
                      Raspadinhas
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Detalhes</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-neutral-400">Carregando detalhes da raspadinha...</p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  if (error) {
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
                    <BreadcrumbLink href="/v2/administrator/scratchs" className="text-neutral-400 hover:text-white">
                      Raspadinhas
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Detalhes</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <div className="flex gap-4">
                  <Button onClick={fetchScratchCard} className="bg-yellow-600 hover:bg-yellow-700">
                    Tentar Novamente
                  </Button>
                  <Button onClick={handleBack} variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
                    Voltar
                  </Button>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  if (!scratchCard) {
    return null;
  }

  const maxPrize = Math.max(...scratchCard.prizes.map(prize => parseFloat(prize.value || '0')));
  const totalProbability = scratchCard.prizes.reduce((sum, prize) => sum + parseFloat(prize.probability || '0'), 0);

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
                  <BreadcrumbLink href="/v2/administrator/scratchs" className="text-neutral-400 hover:text-white">
                    Raspadinhas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Detalhes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{scratchCard.name}</h1>
                  <p className="text-neutral-400 text-sm">ID: {scratchCard.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(scratchCard.is_active)}>
                  {scratchCard.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button
                  onClick={handleEdit}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image and Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Image Card */}
                <Card className="bg-neutral-800 border-neutral-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Imagem da Raspadinha</h3>
                  <div className="relative w-full h-64 bg-neutral-700 rounded-lg overflow-hidden">
                    {scratchCard.image_url ? (
                      <Image
                        src={fixImageUrl(scratchCard.image_url) || ''}
                        alt={scratchCard.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Gift className="w-16 h-16 text-neutral-500" />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Basic Info Card */}
                <Card className="bg-neutral-800 border-neutral-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Nome</label>
                      <p className="text-white font-medium">{scratchCard.name}</p>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Descrição</label>
                      <p className="text-neutral-300">{scratchCard.description}</p>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Preço</label>
                      <p className="text-white font-medium text-lg">{formatCurrency(scratchCard.price)}</p>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Prêmio Máximo</label>
                      <p className="text-green-400 font-medium text-lg">{formatCurrency(maxPrize)}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Stats and Prizes */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-neutral-800 border-neutral-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm font-medium">RTP Alvo</p>
                        <p className="text-yellow-400 text-xl font-bold">{formatPercentage(scratchCard.target_rtp)}</p>
                      </div>
                      <Target className="w-8 h-8 text-yellow-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-neutral-800 border-neutral-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm font-medium">RTP Atual</p>
                        <p className={`text-xl font-bold ${
                          parseFloat(scratchCard.current_rtp) >= parseFloat(scratchCard.target_rtp) 
                            ? 'text-green-400' 
                            : 'text-yellow-400'
                        }`}>
                          {formatPercentage(scratchCard.current_rtp)}
                        </p>
                      </div>
                      <Percent className="w-8 h-8 text-neutral-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-neutral-800 border-neutral-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm font-medium">Jogos</p>
                        <p className="text-purple-400 text-xl font-bold">{scratchCard.total_games_played.toLocaleString('pt-BR')}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-neutral-800 border-neutral-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm font-medium">Receita</p>
                        <p className="text-green-400 text-xl font-bold">{formatCurrency(scratchCard.total_revenue)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                  </Card>
                </div>

                {/* Financial Stats */}
                <Card className="bg-neutral-800 border-neutral-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Financeiras</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Receita Total</label>
                      <p className="text-green-400 font-bold text-2xl">{formatCurrency(scratchCard.total_revenue)}</p>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Pagamentos Totais</label>
                      <p className="text-red-400 font-bold text-2xl">{formatCurrency(scratchCard.total_payouts)}</p>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm font-medium">Lucro</label>
                      <p className="text-yellow-400 font-bold text-2xl">
                        {formatCurrency(parseFloat(scratchCard.total_revenue) - parseFloat(scratchCard.total_payouts))}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Prizes Table */}
                <Card className="bg-neutral-800 border-neutral-700">
                  <div className="p-6 border-b border-neutral-700">
                    <h3 className="text-lg font-semibold text-white">Prêmios Configurados</h3>
                    <p className="text-neutral-400 text-sm">{scratchCard.prizes.length} prêmios • Probabilidade total: {formatPercentage(totalProbability)}</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {scratchCard.prizes.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Gift className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Nenhum prêmio configurado</h3>
                        <p className="text-neutral-400 text-sm">Esta raspadinha ainda não possui prêmios</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-700">
                            <th className="text-left p-4 text-neutral-400 font-medium">Imagem</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Nome</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Descrição</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Tipo</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Valor</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Probabilidade</th>
                            <th className="text-left p-4 text-neutral-400 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scratchCard.prizes.map((prize) => (
                            <tr key={prize.id} className="border-b border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                              <td className="p-4">
                                <div className="w-12 h-12 bg-neutral-700 rounded-lg overflow-hidden flex items-center justify-center">
                                  {prize.image_url ? (
                                    <Image
                                      src={fixImageUrl(prize.image_url) || ''}
                                      alt={prize.name}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <Gift className="w-6 h-6 text-neutral-500" />
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-white font-medium">{prize.name}</span>
                              </td>
                              <td className="p-4">
                                <span className="text-neutral-300 text-sm">{prize.description}</span>
                              </td>
                              <td className="p-4">
                                <Badge className={getPrizeTypeColor(prize.type)}>
                                  {getPrizeTypeName(prize.type)}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <span className="text-green-400 font-medium">
                                  {formatCurrency(prize.value)}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-neutral-300">
                                  {formatPercentage(prize.probability)}
                                </span>
                              </td>
                              <td className="p-4">
                                <Badge className={getStatusColor(prize.is_active)}>
                                  {prize.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Card>

                {/* Timestamps */}
                <Card className="bg-neutral-800 border-neutral-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações de Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neutral-400" />
                      <div>
                        <label className="text-neutral-400 text-sm font-medium">Criado em</label>
                        <p className="text-white">{formatDate(scratchCard.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neutral-400" />
                      <div>
                        <label className="text-neutral-400 text-sm font-medium">Atualizado em</label>
                        <p className="text-white">{formatDate(scratchCard.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Editar Raspadinha
            </DialogTitle>
          </DialogHeader>
          
          {editError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{editError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300">Nome</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Digite o nome da raspadinha"
                disabled={editLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-neutral-300">Descrição</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => handleEditFormChange('description', e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Digite a descrição"
                disabled={editLoading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-neutral-300">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white"
                  placeholder="0.00"
                  disabled={editLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_rtp" className="text-neutral-300">RTP Alvo (%)</Label>
                <Input
                  id="target_rtp"
                  type="number"
                  step="0.1"
                  value={editForm.target_rtp}
                  onChange={(e) => handleEditFormChange('target_rtp', e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white"
                  placeholder="90.0"
                  disabled={editLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => handleEditFormChange('is_active', checked)}
                disabled={editLoading}
              />
              <Label htmlFor="is_active" className="text-neutral-300">Raspadinha Ativa</Label>
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
              onClick={handleUpdateScratchCard}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={editLoading}
            >
              {editLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}