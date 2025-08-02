import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import ScratchCard from 'react-scratchcard-v4';
import Winners from '@/components/winners';
import { toast } from 'sonner';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

// Interfaces para a API
interface Prize {
  id: string;
  scratchCardId: string;
  name: string;
  description: string;
  type: string;
  value: string;
  product_name: string | null;
  redemption_value: string | null;
  image_url: string;
  probability: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ScratchCardData {
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: ScratchCardData;
}

// Interfaces para o jogo
interface GamePrize {
  id: string;
  name: string;
  type: string;
  value: string;
  product_name: string | null;
  redemption_value: string | null;
  image_url: string;
}

interface GameResult {
  isWinner: boolean;
  amountWon: string;
  prize: GamePrize | null;
}

// Esta interface agora reflete a resposta real da sua API de jogo.
interface PlayGameResponse {
  success: boolean;
  message: string;
  prize: GamePrize;
  newBalance: number;
}

// Tipos para os itens da raspadinha
interface ScratchItem {
  id: number;
  type: string;
  value: number;
  icon: string;
}

// Estados do jogo
type GameState = 'idle' | 'loading' | 'playing' | 'completed';

const ScratchCardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, token, updateUser } = useAuth();
  const isAuthenticated = !!user;
  const { width, height } = useWindowSize();
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 640);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [scratchCardData, setScratchCardData] = useState<ScratchCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [scratchItems, setScratchItems] = useState<ScratchItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [scratchComplete, setScratchComplete] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [playingGame, setPlayingGame] = useState(false);

  const fixImageUrl = (url: string) => {
    if (!url) return '';
    return url
      .replace('raspa.ae', 'https://raspadinha-api.onrender.com')
      .replace('/uploads/scratchcards/', '/uploads/')
      .replace('/uploads/prizes/', '/uploads/');
  };

  useEffect(() => {
    const fetchScratchCardData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`https://raspadinha-api.onrender.com/v1/api/scratchcards/${id}`);
        const data: ApiResponse = await response.json();
        if (data.success) {
          setScratchCardData(data.data);
        } else {
          setError('Raspadinha não encontrada');
        }
      } catch (err) {
        setError('Erro ao carregar raspadinha');
      } finally {
        setLoading(false);
      }
    };
    fetchScratchCardData();
  }, [id]);

  const generateScratchItems = (result: GameResult): ScratchItem[] => {
    if (!scratchCardData?.prizes?.length) return [];
    const allPrizesAsItems = scratchCardData.prizes.map((prize, index) => ({
      type: prize.id,
      icon: fixImageUrl(prize.image_url) || '/50_money.webp',
      value: parseFloat(prize.value || prize.redemption_value || '0'),
    }));
    const items: ScratchItem[] = [];
    if (result.isWinner && result.prize) {
      const winningItem = allPrizesAsItems.find(p => p.type === result.prize?.id);
      if (winningItem) {
        for (let i = 0; i < 3; i++) items.push({ id: items.length, ...winningItem });
      }
    }
    const nonWinningItems = allPrizesAsItems.filter(p => p.type !== result.prize?.id);
    let i = items.length;
    while (i < 9) {
      const randomItem = nonWinningItems[Math.floor(Math.random() * nonWinningItems.length)] || { type: 'loser', icon: '/50_money.webp', value: 0 };
      items.push({ id: i, ...randomItem });
      i++;
    }
    return items.sort(() => Math.random() - 0.5);
  };

  const refreshUserBalance = async () => {
    if (!token) return;
    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        updateUser(data.data);
      }
    } catch (error) {
      console.error('Erro ao atualizar saldo do usuário:', error);
    }
  };

  const handlePlay = async () => {
    if (!isAuthenticated || playingGame || !id || !token) {
      if (!isAuthenticated) toast.error("Você precisa fazer login para jogar.");
      return;
    }
    setGameState('loading');
    setPlayingGame(true);
    setScratchComplete(false);
    setShowConfetti(false);
    setHasWon(false);
    setTotalWinnings(0);
    setGameResult(null);
    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/scratchcards/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ scratchCardId: id })
      });
      const data: PlayGameResponse = await response.json();
      if (data.success) {
        const result: GameResult = {
          isWinner: data.prize && parseFloat(data.prize.value) > 0,
          amountWon: data.prize ? data.prize.value : '0',
          prize: data.prize,
        };
        setGameResult(result);
        const items = generateScratchItems(result);
        setScratchItems(items);
        setGameState('playing');
        if (user && typeof data.newBalance === 'number') {
          updateUser({ ...user, balance: data.newBalance });
        }
      } else {
        setGameState('idle');
        toast.error(data.message || 'Erro ao iniciar o jogo. Tente novamente.');
      }
    } catch (error) {
        setGameState('idle');
        toast.error('Erro de conexão ao tentar jogar.');
        console.error('Erro na requisição de jogo:', error);
    } finally {
        setPlayingGame(false);
    }
  };

  const handleScratchComplete = async () => {
    if (scratchComplete || !gameResult) return;
    setScratchComplete(true);
    setHasWon(gameResult.isWinner);
    setTotalWinnings(parseFloat(gameResult.amountWon));
    if (gameResult.isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    setGameState('completed');
    await refreshUserBalance();
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.3} />
      )}
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Winners />

        <div className="mt-4 bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8" style={{ overscrollBehavior: 'contain' }}>
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {scratchCardData?.name || '...'}
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm px-2">
              {scratchCardData?.description || '...'}
            </p>
          </div>

          {gameState === 'idle' && (
            <div className="bg-neutral-700 rounded-lg p-3 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              <div className="relative w-64 h-64 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-lg overflow-hidden mx-auto">
                <Image src="/raspe_aqui.webp" alt="Raspe Aqui" fill className="object-contain opacity-40" />
                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br rounded-xl from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2">Faça login para jogar</h3>
                      <p className="text-neutral-400 text-xs sm:text-sm mb-4">Conecte-se para raspar</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center mt-3 sm:mt-4">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Reúna 3 imagens iguais e conquiste seu prêmio!</h3>
                <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
                  O valor correspondente será creditado automaticamente na sua conta.<br />
                  Se preferir receber o produto físico, basta entrar em contato com o nosso suporte.
                </p>
                <Button 
                  onClick={handlePlay}
                  disabled={!isAuthenticated || !scratchCardData}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl w-full lg:w-1/2 transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20 disabled:border-neutral-600/20 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {!isAuthenticated ? 'Faça login para jogar' : scratchCardData ? `Comprar e Raspar (R$ ${parseFloat(scratchCardData.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})` : 'Carregando...'}
                </Button>
              </div>
            </div>
          )}

          {gameState === 'loading' && (
            <div className="bg-neutral-700 rounded-lg p-6 sm:p-8 border border-neutral-600 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Preparando sua raspadinha...</h3>
                <p className="text-neutral-400 text-sm">Aguarde enquanto geramos seus prêmios</p>
              </div>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'completed') && (
            <div className="bg-neutral-700 rounded-lg p-4 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              {gameState === 'playing' && (
                <div className="text-center mb-4">
                  <p className="text-white font-semibold text-sm sm:text-base mb-2">🎯 Raspe a superfície para descobrir os prêmios!</p>
                  <p className="text-yellow-400 text-xs sm:text-sm">💡 Você precisa de 3 símbolos iguais para ganhar!</p>
                </div>
              )}
              
              {gameState === 'playing' && (
                <div className="flex justify-center mb-4 touch-none overflow-hidden" style={{ touchAction: 'none' }}>
                   <div className="w-full flex justify-center" style={{ touchAction: 'none', userSelect: 'none' }}>
                    <ScratchCard
                      width={screenWidth < 640 ? Math.min(280, screenWidth - 60) : screenWidth < 1024 ? 450 : 500}
                      height={screenWidth < 640 ? Math.min(280, screenWidth - 60) : screenWidth < 1024 ? 450 : 500}
                      image="/raspe_aqui.webp"
                      finishPercent={85}
                      brushSize={screenWidth < 640 ? 12 : screenWidth < 1024 ? 20 : 25}
                      onComplete={handleScratchComplete}
                    >
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 p-4">
                      <div className="grid grid-cols-3 gap-2 h-full">
                        {scratchItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex flex-col items-center justify-center p-2 border border-neutral-600"
                          >
                            <div className="w-8 h-8 mb-1 relative">
                              <Image src={item.icon} alt={`Prêmio ${item.value}`} fill className="object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/50_money.webp'; }} />
                            </div>
                            <p className="text-white text-xs font-bold text-center">
                              {item.value > 0 ? `R$ ${item.value}` : 'Ops! Hoje não'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScratchCard>
                  </div>
                </div>
              )}
              
              {gameState === 'completed' && (
                <div className="text-center mb-4">
                  {hasWon ? (
                    <div>
                      <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-2">🎉 Parabéns! Você ganhou!</h3>
                      {gameResult?.prize?.type === 'PRODUCT' ? (
                        <p className="text-white font-semibold text-base sm:text-lg">{gameResult.prize.product_name || gameResult.prize.name}</p>
                      ) : (
                        <p className="text-white font-semibold text-base sm:text-lg">Total: R$ {totalWinnings.toFixed(2).replace('.', ',')}</p>
                      )}
                      <p className="text-neutral-400 text-xs sm:text-sm mt-1">Você conseguiu 3 símbolos iguais!</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-2">😔 Ops! Não foi dessa vez!</h3>
                      <p className="text-neutral-400 text-sm">Você precisa de 3 símbolos iguais para ganhar</p>
                    </div>
                  )}
                </div>
              )}
              
              {gameState === 'completed' && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
                  {scratchItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg border border-neutral-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-neutral-600/20 to-neutral-700/20">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 relative mx-auto">
                          <Image src={item.icon} alt={`Prêmio ${item.value}`} fill className="object-contain" />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-center text-white">
                           {item.value > 0 ? `R$ ${item.value}` : 'Ops! Hoje não'}
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {gameState === 'completed' && (
                <div className="text-center mt-4">
                  {hasWon && gameResult?.prize?.type === 'PRODUCT' ? (
                    <Button onClick={() => router.push('/v1/profile/inventory')} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-400/20 text-sm">
                      Ir para Inventário
                    </Button>
                  ) : (
                    <Button onClick={handlePlay} disabled={!isAuthenticated || !scratchCardData} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed">
                      {scratchCardData ? `Jogar Novamente (R$ ${parseFloat(scratchCardData.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})` : 'Carregando...'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-start">Prêmios Disponíveis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {scratchCardData?.prizes && scratchCardData.prizes.length > 0 ? (
                scratchCardData.prizes.slice(0, 17).map((prize) => (
                  <div key={prize.id} className="flex-shrink-0 w-38 xl:w-auto">
                    <div className="flex flex-col border-2 border-yellow-500/30 p-3 rounded-lg bg-gradient-to-t from-yellow-500/17 from-[0%] to-[35%] to-yellow-400/10 cursor-pointer aspect-square hover:scale-105 transition-all duration-300">
                    <Image
                      src={fixImageUrl(prize.image_url) || "/50_money.webp"}
                      alt={prize.type === 'MONEY' ? `${parseFloat(prize.value || '0').toFixed(0)} Reais` : prize.name}
                      width={80}
                      height={80}
                      className="size-full p-3 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/50_money.webp'; }}
                    />
                      <h3 className="text-sm font-semibold mb-3 overflow-hidden text-ellipsis text-nowrap w-30 text-white">
                        {prize.type === 'MONEY' ? `${parseFloat(prize.value || '0').toFixed(0)} Reais` : prize.name}
                      </h3>
                      <div className="px-1.5 py-1 bg-white text-neutral-900 rounded-sm text-sm font-semibold self-start">
                        R$ {prize.type === 'MONEY' ? parseFloat(prize.value || '0').toFixed(2).replace('.', ',') : parseFloat(prize.redemption_value || '0').toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-neutral-400 text-sm">Nenhum prêmio disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
    </div>
  );
};

export default ScratchCardPage;
