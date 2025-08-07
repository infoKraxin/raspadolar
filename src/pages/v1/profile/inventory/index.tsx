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
import { getAppGradient } from '@/lib/colors';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface PendingRedemption {
  id: string;
  prize_name: string;
  prize_image_url: string;
  redemption_value: string;
  status: string;
  won_at: string;
}

interface InventoryResponse {
  success: boolean;
  message: string;
  data: PendingRedemption[];
}

const InventoryPage: React.FC = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRedemptions, setPendingRedemptions] = useState<PendingRedemption[]>([]);
  
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

  const fetchPendingRedemptions = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/redemptions/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: InventoryResponse = await response.json();
      if (data.success) {
        setPendingRedemptions(data.data);
      } else {
        toast.error(data.message || 'Erro ao carregar inventário');
        setError('Erro ao carregar inventário');
      }
    } catch (err) {
      toast.error('Erro de conexão ao carregar inventário');
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar resgates pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (redemptionId: string) => {
    toast.info(`Funcionalidade de resgate para o item ${redemptionId} ainda não implementada.`);
  };

  useEffect(() => {
    if (!authLoading) {
      if (user && token) {
        fetchPendingRedemptions();
      } else if (!user) {
        router.push('/');
      }
    }
  }, [user, token, authLoading, router]);

  const handleBackClick = () => {
    router.push('/v1/profile');
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Button 
          onClick={handleBackClick}
          variant="outline"
          className="mb-4 sm:mb-6 bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Perfil
        </Button>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            Meu Inventário de Prêmios
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Seus prêmios ganhos para resgate
          </p>
        </div>

        {loading ? (
          <div className="text-center p-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-neutral-800 rounded-xl border border-red-500/30 p-8 text-center">
             <h3 className="text-red-400 font-bold text-lg mb-2">Erro ao carregar inventário</h3>
             <p className="text-neutral-400 text-sm mb-4">{error}</p>
             <Button onClick={fetchPendingRedemptions} className={`${getAppGradient()} text-white`}>
               Tentar Novamente
             </Button>
          </div>
        ) : pendingRedemptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRedemptions.map((redemption) => (
              <div key={redemption.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 flex flex-col">
                <div className="relative w-full h-40 bg-neutral-700 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={redemption.prize_image_url || '/50_money.webp'}
                    alt={redemption.prize_name}
                    fill
                    className="object-contain p-2"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/50_money.webp'; }}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-lg mb-2">{redemption.prize_name}</h3>
                  <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                    <span className="font-medium">Valor para resgate:</span>
                    <span>R$ {parseFloat(redemption.redemption_value).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Ganho em {formatDate(redemption.won_at)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <Button 
                    size="sm"
                    onClick={() => handleRedeem(redemption.id)}
                    className={`${getAppGradient()} text-white w-full`}
                  >
                    Resgatar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 text-center">
            <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Inventário Vazio</h3>
            <p className="text-neutral-400 text-sm mb-4">Você ainda não ganhou nenhum prêmio de produto.</p>
            <Button 
              onClick={() => router.push('/')}
              className={`${getAppGradient()} text-white`}
            >
              Jogar Agora
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InventoryPage;
