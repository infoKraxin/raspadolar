import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Lock, Loader2, Sparkles } from 'lucide-react'; // Adicionado Sparkles
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import ScratchCard from 'react-scratchcard-v4';
import Winners from '@/components/winners';
import { toast } from 'sonner';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

// ... (Todas as suas interfaces permanecem as mesmas)
interface Prize { id: string; name: string; type: string; value: string; product_name: string | null; redemption_value: string | null; image_url: string; }
interface ScratchCardData { id: string; name: string; description: string; price: string; image_url: string; prizes: Prize[]; }
interface GamePrize { id: string; name: string; type: string; value: string; product_name: string | null; redemption_value: string | null; image_url: string; }
interface GameResult { isWinner: boolean; amountWon: string; prize: GamePrize | null; }
interface PlayGameResponse { success: boolean; message: string; prize: GamePrize | null; newBalance: number; }
interface ScratchItem { id: number; type: string; value: number; icon: string; name?: string; isWin?: boolean; }
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
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [playingGame, setPlayingGame] = useState(false);

  const fetchScratchCardData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await fetch(`https://raspadinha-api.onrender.com/v1/api/scratchcards/${id}`);
      const data = await response.json();
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

  useEffect(() => {
    if (id) {
      fetchScratchCardData();
    }
  }, [id]);

  const generateScratchItems = (result: GameResult): ScratchItem[] => {
    if (!scratchCardData?.prizes?.length) return [];

    const allPrizes = scratchCardData.prizes.map(prize => ({
        id: prize.id,
        type: prize.id,
        icon: prize.image_url || '/50_money.webp',
        value: parseFloat(prize.type === 'MONEY' ? prize.value : prize.redemption_value || '0'),
        name: prize.type === 'MONEY' ? `R$ ${parseFloat(prize.value).toFixed(2)}` : prize.product_name || prize.name,
    }));

    let items: ScratchItem[] = [];

    if (result.isWinner && result.prize) {
        const winningItem = allPrizes.find(p => p.id === result.prize?.id);
        if (!winningItem) return [];

        for (let i = 0; i < 3; i++) {
            items.push({ id: items.length, ...winningItem, isWin: true });
        }

        const otherPrizes = allPrizes.filter(p => p.id !== winningItem.id);
        for (let i = 0; i < 6; i++) {
            const randomPrize = otherPrizes[Math.floor(Math.random() * otherPrizes.length)] || winningItem;
            items.push({ id: items.length, ...randomPrize, isWin: false });
        }
    } else {
        const prizeCounts: { [key: string]: number } = {};
        for (let i = 0; i < 9; i++) {
            let availablePrizes = allPrizes.filter(p => (prizeCounts[p.id] || 0) < 2);
            if (availablePrizes.length === 0) availablePrizes = allPrizes;
            const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
            items.push({ id: items.length, ...randomPrize, isWin: false });
            prizeCounts[randomPrize.id] = (prizeCounts[randomPrize.id] || 0) + 1;
        }
    }
    return items.sort(() => Math.random() - 0.5);
  };
  
  const playGame = async (): Promise<GameResult | null> => {
    if (!id || !token) {
        toast.error("Você precisa estar logado para jogar.");
        return null;
    }
    setPlayingGame(true);
    try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/scratchcards/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ scratchCardId: id })
        });
        const data: PlayGameResponse = await response.json();
        if (data.success) {
            if (user) updateUser({ ...user, balance: data.newBalance });
            return {
                isWinner: !!(data.prize && data.prize.type !== 'NONE'),
                amountWon: data.prize?.value || '0',
                prize: data.prize,
            };
        } else {
            toast.error(data.message || 'Não foi possível iniciar o jogo.');
            return null;
        }
    } catch (error) {
        toast.error('Erro de conexão com o servidor.');
        return null;
    } finally {
        setPlayingGame(false);
    }
  };

  const handleBuyAndScratch = async () => {
    if (playingGame) return;
    setGameState('loading');
    const result = await playGame();
    if (result) {
      setGameResult(result);
      const items = generateScratchItems(result);
      setScratchItems(items);
      setGameState('playing');
    } else {
      setGameState('idle');
    }
  };
  
  const handleScratchComplete = () => {
    if (gameState === 'completed' || !gameResult) return;
    
    setGameState('completed');

    if (gameResult.isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // --- NOVA FUNÇÃO PARA O BOTÃO "RASPAR TUDO" ---
  const handleRevealAll = () => {
    if (gameState === 'playing') {
        handleScratchComplete();
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setGameResult(null);
    setScratchItems([]);
    setShowConfetti(false);
  };

  if (loading) {
    return (
        <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
    );
  }

  if (error) {
    return (
        <div className={`${poppins.className} min-h-screen bg-neutral-900 flex flex-col items-center justify-center`}>
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
        </div>
    );
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Winners />

        <div className="mt-4 bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-white">{scratchCardData?.name}</h2>
            <p className="text-neutral-400 text-xs sm:text-sm">{scratchCardData?.description}</p>
          </div>

          {gameState === 'idle' && (
            <div className="text-center">
              <Image src="/raspe_aqui.webp" alt="Raspe Aqui" width={400} height={400} className="mx-auto opacity-40 mb-4" />
              <p className="text-neutral-400 text-sm mb-4">Reúna 3 imagens iguais e conquiste seu prêmio!</p>
              <Button 
                onClick={handleBuyAndScratch}
                disabled={!isAuthenticated || playingGame}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-lg"
              >
                {playingGame ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                !isAuthenticated ? 'Faça login para jogar' : `Comprar e Raspar (R$ ${parseFloat(scratchCardData?.price || '0').toFixed(2)})`}
              </Button>
            </div>
          )}

          {gameState === 'loading' && (
             <div className="text-center p-8">
                <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl">Preparando sua raspadinha...</h3>
              </div>
          )}
          
          {(gameState === 'playing' || gameState === 'completed') && (
            <div className="text-center">
                {/* --- BOTÃO "RASPAR TUDO" ADICIONADO AQUI --- */}
                {gameState === 'playing' && (
                    <div className="mb-4">
                        <Button onClick={handleRevealAll} variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400">
                            <Sparkles className="mr-2 h-4 w-4"/>
                            Raspar Tudo (Revelar)
                        </Button>
                    </div>
                )}

              {gameState === 'playing' ? (
                <div className="flex justify-center touch-none overflow-hidden">
                   <ScratchCard
                      width={screenWidth < 640 ? 300 : 450}
                      height={screenWidth < 640 ? 300 : 450}
                      image="/raspe_aqui.webp"
                      finishPercent={80}
                      brushSize={screenWidth < 640 ? 25 : 40}
                      onComplete={handleScratchComplete}
                    >
                        <div className="grid grid-cols-3 gap-2 h-full p-4 bg-neutral-700">
                            {scratchItems.map(item => (
                                <div key={item.id} className="bg-neutral-800 rounded-lg flex flex-col items-center justify-center p-2">
                                    <Image src={item.icon} alt={item.name || ''} width={64} height={64} className="object-contain h-10 w-10 sm:h-16 sm:w-16" />
                                    <p className="text-white text-xs font-bold text-center mt-1">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </ScratchCard>
                </div>
              ) : (
                // --- TELA DE RESULTADO (APÓS RASPAR OU CLICAR EM "RASPAR TUDO") ---
                <div>
                    {gameResult?.isWinner ? (
                        <div className="text-center mb-4 p-4 rounded-lg bg-green-500/10">
                            <h3 className="text-green-400 font-bold text-2xl">🎉 Parabéns! Você ganhou!</h3>
                            <p className="text-white text-lg">{gameResult.prize?.type === 'PRODUCT' ? gameResult.prize.product_name : `R$ ${parseFloat(gameResult.amountWon).toFixed(2)}`}</p>
                        </div>
                      ) : (
                        <div className="text-center mb-4 p-4 rounded-lg bg-red-500/10">
                           <h3 className="text-red-400 font-bold text-2xl">😔 Ops! Não foi dessa vez!</h3>
                        </div>
                      )}

                    <div className="grid grid-cols-3 gap-2 h-auto p-4 bg-neutral-700 rounded-lg">
                         {scratchItems.map(item => (
                            <div key={item.id} className={`bg-neutral-800 rounded-lg flex flex-col items-center justify-center p-2 aspect-square ${item.isWin ? 'ring-2 ring-yellow-400' : ''}`}>
                                <Image src={item.icon} alt={item.name || ''} width={64} height={64} className="object-contain h-10 w-10 sm:h-16 sm:w-16" />
                                <p className="text-white text-xs font-bold text-center mt-1">{item.name}</p>
                            </div>
                        ))}
                    </div>
                    <Button onClick={resetGame} className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">Jogar Novamente</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScratchCardPage;
