import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Trash2, Plus, Gift, DollarSign, Users, TrendingUp, Search, Loader2, Star } from 'lucide-react';
import { Poppins } from 'next/font/google';

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
  is_featured: boolean;
  target_rtp: string;
  current_rtp: string;
  total_revenue: string;
  total_payouts: string;
  total_games_played: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  prizes: Prize[];
  _count: {
    games: number;
  };
}

interface ScratchCardsResponse {
  success: boolean;
  message: string;
  data: ScratchCard[];
  count: number;
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



export default function ScratchCardsPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removido statusFilter pois agora só mostramos raspadinhas ativas
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<ScratchCard | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [cardToFeature, setCardToFeature] = useState<ScratchCard | null>(null);
  const [featuring, setFeaturing] = useState(false);

  const fetchScratchCards = async () => {
    if (!token) {
      setError('Token de autenticação não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.raspapixoficial.com/v1/api/scratchcards/admin/all?includeInactive=false', {
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

      const data: ScratchCardsResponse = await response.json();
      setScratchCards(data.data || []);
    } catch (err) {
      console.error('Erro ao buscar raspadinhas:', err);
      setError('Erro ao carregar raspadinhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchScratchCards();
    } else if (!authLoading && !token) {
      setError('Usuário não autenticado');
      setLoading(false);
    }
  }, [token, authLoading]);

  const handleView = (id: string) => {
    router.push(`/v2/administrator/scratchs/${id}`);
  };

  const handleDelete = (card: ScratchCard) => {
    setCardToDelete(card);
    setDeleteModalOpen(true);
  };

  const handleToggleFeatured = (card: ScratchCard) => {
    setCardToFeature(card);
    setFeatureModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`https://api.raspapixoficial.com/v1/api/scratchcards/admin/${cardToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setScratchCards(prev => prev.filter(card => card.id !== cardToDelete.id));
        setDeleteModalOpen(false);
        setCardToDelete(null);
      } else {
        throw new Error('Erro ao excluir raspadinha');
      }
    } catch (err) {
      console.error('Erro ao excluir raspadinha:', err);
      alert('Erro ao excluir raspadinha');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCardToDelete(null);
  };

  const confirmToggleFeatured = async () => {
    if (!cardToFeature) return;

    try {
      setFeaturing(true);
      const response = await fetch('https://api.raspapixoficial.com/v1/api/admin/scratchcards/toggle-featured', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scratchCardId: cardToFeature.id,
          isFeatured: !cardToFeature.is_featured
        })
      });

      if (response.ok) {
        // Atualizar o estado local
        setScratchCards(prev => prev.map(card => 
          card.id === cardToFeature.id 
            ? { ...card, is_featured: !card.is_featured }
            : card
        ));
        setFeatureModalOpen(false);
        setCardToFeature(null);
      } else {
        throw new Error('Erro ao alterar destaque da raspadinha');
      }
    } catch (err) {
      console.error('Erro ao alterar destaque da raspadinha:', err);
      alert('Erro ao alterar destaque da raspadinha');
    } finally {
      setFeaturing(false);
    }
  };

  const cancelToggleFeatured = () => {
    setFeatureModalOpen(false);
    setCardToFeature(null);
  };

  const handleCreate = () => {
    router.push('/v2/administrator/scratchs/create');
  };

  const filteredCards = scratchCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Como agora só carregamos raspadinhas ativas, não precisamos filtrar por status
    return matchesSearch;
  });

  // Calcular estatísticas (apenas raspadinhas ativas)
  const totalCards = scratchCards.length;
  const totalGamesPlayed = scratchCards.reduce((sum, card) => sum + card.total_games_played, 0);
  const totalRevenue = scratchCards.reduce((sum, card) => sum + parseFloat(card.total_revenue || '0'), 0);

  const statsCards = [
    {
      title: "Total de Raspadinhas",
      value: totalCards.toString(),
      icon: Gift,
      description: "Raspadinhas cadastradas",
      color: "text-yellow-400"
    },
    {
      title: "Raspadinhas Ativas",
      value: totalCards.toString(),
      icon: TrendingUp,
      description: "Disponíveis para venda",
      color: "text-green-400"
    },
    {
      title: "Total de Jogos",
      value: totalGamesPlayed.toLocaleString('pt-BR'),
      icon: Users,
      description: "Jogos realizados",
      color: "text-purple-400"
    },
    {
      title: "Receita Total",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      description: "Receita gerada",
      color: "text-yellow-400"
    }
  ];

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getMaxPrize = (prizes: Prize[]) => {
    if (!prizes || prizes.length === 0) return 0;
    return Math.max(...prizes.map(prize => parseFloat(prize.value || '0')));
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
                    <BreadcrumbPage className="text-white font-medium">Raspadinhas</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-neutral-400">Carregando raspadinhas...</p>
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
                    <BreadcrumbPage className="text-white font-medium">Raspadinhas</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={fetchScratchCards} className="bg-yellow-600 hover:bg-yellow-700">
                  Tentar Novamente
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
                  <BreadcrumbPage className="text-white font-medium">Raspadinhas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Raspadinhas</h1>
                  <p className="text-neutral-400 text-sm">Total de {scratchCards.length} raspadinhas</p>
                </div>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Raspadinha
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-neutral-800 border-neutral-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-neutral-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className={`text-2xl font-bold mb-2 ${stat.color}`}>{stat.value}</p>
                      <p className="text-neutral-500 text-xs">{stat.description}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                      <stat.icon className="w-6 h-6 text-neutral-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Search Section */}
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Buscar por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-yellow-500"
                  />
                </div>
                {/* Removido filtro de status pois agora só mostramos raspadinhas ativas */}
              </div>
            </Card>

            {/* Scratch Cards Table */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-white">Lista de Raspadinhas</h3>
                <p className="text-neutral-400 text-sm">Mostrando {filteredCards.length} de {scratchCards.length} raspadinhas</p>
              </div>
              
              <div className="overflow-x-auto">
                {filteredCards.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhuma raspadinha encontrada</h3>
                    <p className="text-neutral-400 text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left p-4 text-neutral-400 font-medium">ID</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Nome</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Descrição</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Preço</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Prêmio Máximo</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">RTP Alvo</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">RTP Atual</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Jogos</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Receita</th>
                        {/* Removida coluna de status pois agora só mostramos raspadinhas ativas */}
                        <th className="text-left p-4 text-neutral-400 font-medium">Destaque</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Criado em</th>
                        <th className="text-left p-4 text-neutral-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCards.map((card) => (
                        <tr key={card.id} className="border-b border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                          <td className="p-4">
                            <span className="text-neutral-300 text-sm font-mono">
                              {card.id.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{card.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-300 text-sm max-w-xs truncate block">
                              {card.description}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium">
                              {formatCurrency(card.price)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-green-400 font-medium">
                              {formatCurrency(getMaxPrize(card.prizes))}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-300">
                              {parseFloat(card.target_rtp).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`font-medium ${
                              parseFloat(card.current_rtp) >= parseFloat(card.target_rtp) 
                                ? 'text-green-400' 
                                : 'text-yellow-400'
                            }`}>
                              {parseFloat(card.current_rtp).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-300">
                              {card.total_games_played.toLocaleString('pt-BR')}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium">
                              {formatCurrency(card.total_revenue)}
                            </span>
                          </td>
                          {/* Removida célula de status pois agora só mostramos raspadinhas ativas */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {card.is_featured ? (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              ) : (
                                <Star className="w-4 h-4 text-neutral-400" />
                              )}
                              <span className="text-neutral-300 text-sm">
                                {card.is_featured ? 'Em Destaque' : 'Normal'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-300 text-sm">
                              {formatDate(card.created_at)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(card.id)}
                                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 p-2"
                                title="Visualizar detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleFeatured(card)}
                                className={`p-2 ${
                                  card.is_featured 
                                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' 
                                    : 'text-neutral-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                                }`}
                                title={card.is_featured ? 'Remover destaque' : 'Adicionar destaque'}
                              >
                                <Star className={`h-4 w-4 ${card.is_featured ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(card)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                                title="Excluir raspadinha"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Tem certeza que deseja excluir a raspadinha <strong className="text-white">"{cardToDelete?.name}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deleting}
              className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Destaque */}
      <Dialog open={featureModalOpen} onOpenChange={setFeatureModalOpen}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {cardToFeature?.is_featured ? 'Remover Destaque' : 'Adicionar Destaque'}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              {cardToFeature?.is_featured ? (
                <>
                  Tem certeza que deseja remover o destaque da raspadinha <strong className="text-white">"{cardToFeature?.name}"</strong>?
                  <br />
                  Ela não aparecerá mais em destaque na página inicial.
                </>
              ) : (
                <>
                  Tem certeza que deseja destacar a raspadinha <strong className="text-white">"{cardToFeature?.name}"</strong>?
                  <br />
                  Ela aparecerá em destaque na página inicial.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={cancelToggleFeatured}
              disabled={featuring}
              className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmToggleFeatured}
              disabled={featuring}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {featuring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {cardToFeature?.is_featured ? 'Removendo...' : 'Adicionando...'}
                </>
              ) : (
                cardToFeature?.is_featured ? 'Remover Destaque' : 'Adicionar Destaque'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}