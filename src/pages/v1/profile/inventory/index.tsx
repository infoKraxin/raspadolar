import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { ArrowLeft, Package, Calendar, Gift, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getAppColor, getAppColorText, getAppColorBorder, getAppColorSvg, getAppGradient } from '@/lib/colors';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface Prize {
  id: string;
  name: string;
  type: string;
  product_name: string;
  redemption_value: string;
  image_url: string;
  description: string;
}

interface ScratchCard {
  id: string;
  name: string;
  image_url: string;
}

interface PendingRedemption {
  id: string;
  userId: string;
  scratchCardId: string;
  prizeId: string;
  is_winner: boolean;
  amount_won: string;
  prize_type: string;
  redemption_choice: boolean;
  status: string;
  played_at: string;
  created_at: string;
  updated_at: string;
  prize: Prize;
  scratchCard: ScratchCard;
}

interface InventoryResponse {
  success: boolean;
  message: string;
  data: {
    pending_redemptions: PendingRedemption[];
    total_pending: number;
  };
}

const InventoryPage: React.FC = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRedemptions, setPendingRedemptions] = useState<PendingRedemption[]>([]);
  const [totalPending, setTotalPending] = useState(0);

  // Função para corrigir URLs de imagem
  const fixImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // Trocar raspa.ae por api.raspapixoficial.com
    let fixedUrl = url.replace('https://raspa.ae/', 'https://api.raspapixoficial.com/');
    
    // Remover 'prizes/' e 'scratchcards/' após 'uploads/'
    fixedUrl = fixedUrl.replace('/uploads/prizes/', '/uploads/');
    fixedUrl = fixedUrl.replace('/uploads/scratchcards/', '/uploads/');
    
    return fixedUrl;
  };

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para buscar resgates pendentes
  const fetchPendingRedemptions = async () => {
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/redemptions/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: InventoryResponse = await response.json();
      
      if (data.success) {
        setPendingRedemptions(data.data.pending_redemptions);
        setTotalPending(data.data.total_pending);
        setError(null);
      } else {
        toast.error('Erro ao carregar inventário');
        setError('Erro ao carregar inventário');
      }
    } catch (err) {
      toast.error('Erro ao conectar com o servidor');
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao buscar resgates pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para resgatar prêmio
  const handleRedeem = async (gameId: string) => {
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      return;
    }

    try {
      const response = await fetch('https://api.raspapixoficial.com/v1/api/users/redemptions/choose', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameId,
          choice: 'money'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Prêmio resgatado com sucesso!');
        // Atualizar a lista após o resgate
        fetchPendingRedemptions();
      } else {
        toast.error(data.message || 'Erro ao resgatar prêmio');
      }
    } catch (err) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Erro ao resgatar prêmio:', err);
    }
  };

  // Buscar dados quando o componente montar
  useEffect(() => {
    if (!authLoading) {
      if (user && token) {
        fetchPendingRedemptions();
      } else if (!user) {
        router.push('/');
      }
    }
  }, [user, token, authLoading]);

  const handleBackClick = () => {
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-neutral-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Button 
          onClick={handleBackClick}
          variant="outline"
          className="mb-4 sm:mb-6 bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
            Meu Inventário
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Seus prêmios ganhos estão aqui
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              Carregando inventário...
            </h3>
            <p className="text-neutral-400 text-sm">
              Aguarde enquanto buscamos seus prêmios
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-red-400 font-bold text-lg mb-2">
              Erro ao carregar inventário
            </h3>
            <p className="text-neutral-400 text-sm mb-4">
              {error}
            </p>
            <Button 
              onClick={fetchPendingRedemptions}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-neutral-400 text-sm mb-1">Total de Prêmios</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{totalPending}</p>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Gift className="w-5 h-5" />
                  <span className="text-sm font-medium">Produtos Disponíveis</span>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            {pendingRedemptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pendingRedemptions.map((redemption) => (
                  <div key={redemption.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 hover:bg-neutral-750 transition-colors duration-300">
                    {/* Prize Image */}
                    <div className="relative w-full h-32 sm:h-40 bg-neutral-700 rounded-lg mb-4 overflow-hidden">
                      <Image
                        src={fixImageUrl(redemption.prize.image_url) || '/50_money.webp'}
                        alt={redemption.prize.product_name}
                        fill
                        className="object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/50_money.webp';
                        }}
                      />
                    </div>

                    {/* Prize Info */}
                    <div className="mb-4">
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                        {redemption.prize.product_name}
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm mb-2 line-clamp-2">
                        {redemption.prize.description}
                      </p>
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="font-medium">Valor:</span>
                        <span>R$ {parseFloat(redemption.prize.redemption_value).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="border-t border-neutral-700 pt-3">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>Ganho em {formatDate(redemption.played_at)}</span>
                      </div>
                      <p className="text-neutral-500 text-xs">
                        Raspadinha: {redemption.scratchCard.name}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          redemption.status === 'COMPLETED' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {redemption.status === 'COMPLETED' ? 'Disponível' : 'Pendente'}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => handleRedeem(redemption.id)}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs"
                        >
                          Resgatar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Package className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  Inventário Vazio
                </h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Você ainda não ganhou nenhum prêmio. Que tal jogar algumas raspadas?
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  className={`${getAppGradient()} text-white`}
                >
                  Jogar Agora
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InventoryPage;