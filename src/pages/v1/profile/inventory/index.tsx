import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Gift, Loader2, Package, Play, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// --- Interfaces para a página ---
interface PurchasedCard {
  inventory_id: number;
  name: string;
  image_url: string;
}

interface WonPrize {
  id: string;
  prize_name: string;
  prize_image_url: string;
  redemption_value: string;
  won_at: string;
}

interface ScratchAllResult {
    cardName: string;
    prizeName: string;
    prizeValue: number;
    isProduct: boolean;
}

const CombinedInventoryPage: React.FC = () => {
  const router = useRouter();
  const { user, token, updateUser, isLoading: authLoading } = useAuth();

  // Estados para as raspadinhas
  const [purchasedCards, setPurchasedCards] = useState<PurchasedCard[]>([]);
  const [isScratching, setIsScratching] = useState(false);
  const [results, setResults] = useState<ScratchAllResult[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para os prêmios ganhos
  const [wonPrizes, setWonPrizes] = useState<WonPrize[]>([]);
  
  // Estado de carregamento geral
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchAllInventories = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Busca os dois inventários em paralelo
      const [cardsResponse, prizesResponse] = await Promise.all([
        fetch('https://raspadinha-api.onrender.com/v1/api/inventory/scratchcards', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('https://raspadinha-api.onrender.com/v1/api/users/redemptions/pending', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      const cardsData = await cardsResponse.json();
      const prizesData = await prizesResponse.json();

      if (cardsData.success) {
        setPurchasedCards(cardsData.data);
      } else {
        toast.error("Erro ao carregar raspadinhas.");
      }

      if (prizesData.success) {
        setWonPrizes(prizesData.data);
      } else {
        toast.error("Erro ao carregar prêmios ganhos.");
      }

    } catch (err) {
      toast.error('Erro de conexão ao carregar inventários.');
      console.error('Erro ao buscar inventários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user && token) {
        fetchAllInventories();
      } else if (!user) {
        router.push('/');
      }
    }
  }, [user, token, authLoading, router]);
  
  const handleScratchAll = async () => {
    if (!token || purchasedCards.length === 0) return;
    setIsScratching(true);
    try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/inventory/scratch-all', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if(data.success) {
            toast.success(data.message);
            if(user) {
                updateUser({ ...user, balance: data.data.newBalance });
            }
            setResults(data.data.results);
            setTotalWinnings(data.data.totalWinnings);
            setIsModalOpen(true);
            setPurchasedCards([]);
        } else {
            toast.error(data.message || "Erro ao raspar.");
        }
    } catch (error) {
        toast.error("Erro de conexão ao raspar.");
    } finally {
        setIsScratching(false);
    }
  };

  const handleRedeem = (prizeId: string) => {
    toast.info(`Funcionalidade de resgate para o prêmio ${prizeId} ainda não implementada.`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button onClick={() => router.push('/v1/profile')} variant="ghost" className="mb-4 text-neutral-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Perfil
        </Button>
        <h1 className="text-3xl font-bold text-white mb-6">Meu Inventário</h1>

        <Tabs defaultValue="scratchcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-800 border border-neutral-700">
            <TabsTrigger value="scratchcards">
                <Ticket className="mr-2 h-4 w-4" /> Raspadinhas ({isLoading ? '...' : purchasedCards.length})
            </TabsTrigger>
            <TabsTrigger value="prizes">
                <Gift className="mr-2 h-4 w-4" /> Prêmios Ganhos ({isLoading ? '...' : wonPrizes.length})
            </TabsTrigger>
          </TabsList>

          {/* Aba de Raspadinhas para Raspar */}
          <TabsContent value="scratchcards" className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Raspadinhas para Raspar</h2>
                <Button
                    onClick={handleScratchAll}
                    disabled={isScratching || purchasedCards.length === 0 || isLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                    {isScratching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Raspar Tudo
                </Button>
            </div>
            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto" /></div>
            ) : purchasedCards.length === 0 ? (
                <div className="text-center py-20 bg-neutral-800 rounded-lg">
                    <Ticket className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white">Nenhuma raspadinha no inventário</h2>
                    <p className="text-neutral-400 mt-2">Compre raspadinhas para vê-las aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {purchasedCards.map((card) => (
                        <div key={card.inventory_id} className="bg-neutral-800 rounded-lg p-3 text-center border border-neutral-700">
                            <Image src={card.image_url} alt={card.name} width={150} height={150} className="mx-auto mb-2 rounded" />
                            <p className="text-white font-semibold text-sm truncate">{card.name}</p>
                        </div>
                    ))}
                </div>
            )}
          </TabsContent>

          {/* Aba de Prêmios Ganhos */}
          <TabsContent value="prizes" className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Prêmios para Resgatar</h2>
            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto" /></div>
            ) : wonPrizes.length === 0 ? (
                <div className="text-center py-20 bg-neutral-800 rounded-lg">
                    <Package className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white">Nenhum prêmio para resgatar</h2>
                    <p className="text-neutral-400 mt-2">Você ainda não ganhou nenhum prêmio de produto.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wonPrizes.map((prize) => (
                        <div key={prize.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                             <div className="relative w-full h-32 bg-neutral-700 rounded-lg mb-4 overflow-hidden">
                                <Image src={prize.prize_image_url || '/50_money.webp'} alt={prize.prize_name} fill className="object-contain p-2" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{prize.prize_name}</h3>
                            <p className="text-neutral-400 text-sm mb-1">Ganho em: {formatDate(prize.won_at)}</p>
                            <p className="text-green-400 font-semibold mb-4">Valor para resgate: {formatCurrency(parseFloat(prize.redemption_value))}</p>
                            <Button size="sm" onClick={() => handleRedeem(prize.id)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                                Resgatar
                            </Button>
                        </div>
                    ))}
                </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
      <Footer />
      
      {/* Modal de Resultados do "Raspar Tudo" */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Resultados do "Raspar Tudo"</DialogTitle>
            <DialogDescription className="text-lg">
              Você ganhou um total de <span className="font-bold text-green-400">{formatCurrency(totalWinnings)}</span>!
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 mt-4">
            {results.map((result, index) => (
                <div key={index} className="flex justify-between items-center bg-neutral-700 p-3 rounded-md">
                    <p className="text-sm text-neutral-300">{result.cardName}</p>
                    <p className={`text-sm font-semibold ${result.prizeValue > 0 ? 'text-green-400' : 'text-neutral-500'}`}>
                        {result.prizeValue > 0 ? `+ ${formatCurrency(result.prizeValue)}` : 'Sem prêmio'}
                    </p>
                </div>
            ))}
          </div>
           <Button onClick={() => setIsModalOpen(false)} className="mt-4 w-full">Fechar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CombinedInventoryPage;
