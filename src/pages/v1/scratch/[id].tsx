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

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

// Tipos para os itens da raspadinha
interface ScratchItem {
  id: number;
  type: 'coin' | 'gem' | 'star' | 'crown' | 'heart';
  value: number;
  icon: string;
  name?: string;
  image?: string;
  isWin?: boolean;
}

// Estados do jogo
type GameState = 'idle' | 'loading' | 'playing' | 'completed';

const ScratchCardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { width, height } = useWindowSize();

  // Estados do jogo
  const [gameState, setGameState] = useState<GameState>('idle');
  const [scratchItems, setScratchItems] = useState<ScratchItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [scratchComplete, setScratchComplete] = useState(false);


  const handleBackClick = () => {
    router.push('/');
  };

  // Função para gerar itens da raspadinha com lógica de 3 iguais
  const generateScratchItems = (): ScratchItem[] => {
    const itemTypes = [
      { type: 'coin', icon: '/50_money.webp', baseValue: 50 },
      { type: 'gem', icon: '/100_money.webp', baseValue: 100 },
      { type: 'star', icon: '/200_money.webp', baseValue: 200 },
      { type: 'crown', icon: '/apple_watch.webp', baseValue: 500 },
      { type: 'heart', icon: '/200_money.webp', baseValue: 25 }
    ];

    const items: ScratchItem[] = [];
    
    // Decidir se vai ser uma raspadinha vencedora (30% de chance)
    const isWinningCard = Math.random() < 0.3;
    
    if (isWinningCard) {
      // Escolher um tipo vencedor
      const winningType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      
      // Adicionar 3 itens do tipo vencedor
      for (let i = 0; i < 3; i++) {
        items.push({
          id: i,
          type: winningType.type as any,
          value: winningType.baseValue,
          icon: winningType.icon
        });
      }
      
      // Preencher o resto com itens aleatórios diferentes
      const remainingTypes = itemTypes.filter(t => t.type !== winningType.type);
      for (let i = 3; i < 9; i++) {
        const randomType = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];
        items.push({
          id: i,
          type: randomType.type as any,
          value: randomType.baseValue,
          icon: randomType.icon
        });
      }
    } else {
      // Raspadinha perdedora - garantir que não há 3 iguais
      for (let i = 0; i < 9; i++) {
        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        items.push({
          id: i,
          type: randomType.type as any,
          value: randomType.baseValue,
          icon: randomType.icon
        });
      }
      
      // Verificar e ajustar para garantir que não há 3 iguais
      const typeCounts: { [key: string]: number } = {};
      items.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      });
      
      // Se algum tipo aparece 3+ vezes, substituir alguns
      Object.keys(typeCounts).forEach(type => {
        if (typeCounts[type] >= 3) {
          const itemsOfType = items.filter(item => item.type === type);
          const otherTypes = itemTypes.filter(t => t.type !== type);
          
          // Substituir itens extras para manter no máximo 2
          for (let i = 2; i < itemsOfType.length; i++) {
            const randomType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
            const itemIndex = items.findIndex(item => item.id === itemsOfType[i].id);
            items[itemIndex] = {
              ...items[itemIndex],
              type: randomType.type as any,
              value: randomType.baseValue,
              icon: randomType.icon
            };
          }
        }
      });
    }

    // Embaralhar os itens
    return items.sort(() => Math.random() - 0.5);
  };

  // Função para verificar se há 3 itens iguais
  const checkForWin = (items: ScratchItem[]): { hasWon: boolean; winningType?: string; winnings?: number } => {
    const typeCounts: { [key: string]: number } = {};
    
    items.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count >= 3) {
        const winningItem = items.find(item => item.type === type);
        return {
          hasWon: true,
          winningType: type,
          winnings: winningItem ? winningItem.value * 3 : 0 // Multiplicar por 3 por ter 3 iguais
        };
      }
    }
    
    return { hasWon: false };
  };

  // Função para iniciar o jogo
  const handleBuyAndScratch = async () => {
    if (!isAuthenticated) return;

    setGameState('loading');
    setScratchComplete(false);
    
    // Simular compra da raspadinha
    setTimeout(() => {
      const items = generateScratchItems();
      setScratchItems(items);
      // No need to set scratched items since we're using react-scratchcard-v2
      setGameState('playing');
      setShowConfetti(false);
      setHasWon(false);
      setTotalWinnings(0);
    }, 2000);
  };



  // Função chamada quando a raspadinha é completada
  const handleScratchComplete = () => {
    if (scratchComplete) return;
    
    setScratchComplete(true);
    
    // Verificar se ganhou
    const result = checkForWin(scratchItems);
    setHasWon(result.hasWon);
    setTotalWinnings(result.winnings || 0);
    
    if (result.hasWon) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    setGameState('completed');
  };

  // Função para jogar novamente
  const handlePlayAgain = () => {
    setGameState('idle');
    setScratchItems([]);
    setScratchComplete(false);
    setShowConfetti(false);
    setHasWon(false);
    setTotalWinnings(0);
  };



  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
        />
      )}
      
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

        {/* Game Area - Full Width */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              PIX na Conta
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm px-2">
              Raspe e receba prêmios em DINHEIRO $$$ até R$2.000 diretamente no seu PIX
            </p>
          </div>

          {/* Game States */}
          {gameState === 'idle' && (
            <div className="bg-neutral-700 rounded-lg p-3 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              <div className="relative w-64 h-64 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-lg overflow-hidden mx-auto">
                <Image
                  src="/raspe_aqui.webp"
                  alt="Raspe Aqui"
                  fill
                  className="object-contain opacity-40"
                />
                
                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br rounded-xl from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                        Faça login para jogar
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm mb-4">
                        Conecte-se para raspar
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-3 sm:mt-4">
                <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
                  💡 Clique em "Comprar e Raspar" para iniciar o jogo
                </p>
                <Button 
                  onClick={handleBuyAndScratch}
                  disabled={!isAuthenticated}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl w-full transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400/20 disabled:border-neutral-600/20 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isAuthenticated ? 'Comprar e Raspar (R$ 1,00)' : 'Faça login para jogar'}
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {gameState === 'loading' && (
            <div className="bg-neutral-700 rounded-lg p-6 sm:p-8 border border-neutral-600 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                  Preparando sua raspadinha...
                </h3>
                <p className="text-neutral-400 text-sm">
                  Aguarde enquanto geramos seus prêmios
                </p>
              </div>
            </div>
          )}

          {/* Playing State - Scratch Card */}
          {(gameState === 'playing' || gameState === 'completed') && (
            <div className="bg-neutral-700 rounded-lg p-4 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              {gameState === 'playing' && (
                <div className="text-center mb-4">
                  <p className="text-white font-semibold text-sm sm:text-base mb-2">
                    🎯 Raspe a superfície para descobrir os prêmios!
                  </p>
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    💡 Você precisa de 3 símbolos iguais para ganhar!
                  </p>
                </div>
              )}
              
              {gameState === 'playing' && (
                <div className="flex justify-center mb-4">
                  <ScratchCard
                    width={512}
                    height={512}
                    image="/raspe_aqui.webp"
                    finishPercent={85}
                    brushSize={20}
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
                              <Image
                                src={item.icon}
                                alt={`Prêmio ${item.value}`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <p className="text-white text-xs font-bold text-center">
                              R$ {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScratchCard>
                </div>
              )}
              
              {gameState === 'completed' && (
                <div className="text-center mb-4">
                  {hasWon ? (
                    <div>
                      <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-2">
                        🎉 Parabéns! Você ganhou!
                      </h3>
                      <p className="text-white font-semibold text-base sm:text-lg">
                        Total: R$ {totalWinnings.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                        Você conseguiu 3 símbolos iguais!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-2">
                        😔 Não foi dessa vez!
                      </h3>
                      <p className="text-neutral-400 text-sm">
                        Você precisa de 3 símbolos iguais para ganhar
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Results Grid for Completed State */}
              {gameState === 'completed' && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
                  {scratchItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg border border-neutral-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-neutral-600/20 to-neutral-700/20">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 relative mx-auto">
                          <Image
                            src={item.icon}
                            alt={`Prêmio ${item.value}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-center text-white">
                          R$ {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {gameState === 'completed' && (
                <div className="text-center mt-4">
                  <Button 
                    onClick={handlePlayAgain}
                    disabled={!isAuthenticated}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    Jogar Novamente (R$ 1,00)
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Game Info */}
          <div className="bg-neutral-700 rounded-lg p-3 sm:p-4 border border-neutral-600">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <p className="text-white font-semibold text-sm sm:text-base">SEU SALDO</p>
                <p className="text-green-400 text-lg sm:text-xl font-bold">
                  {isAuthenticated && user?.wallet?.[0]?.balance ? `R$ ${parseFloat(user.wallet[0].balance).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                </p>
              </div>
              <Button 
                disabled={!isAuthenticated}
                className="bg-neutral-600 hover:bg-neutral-800 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 sm:px-6 rounded-lg cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
              >
                Ver histórico
              </Button>
            </div>
          </div>
        </div>

        {/* Winners Slider - Horizontal */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Ganhadores Recentes
            </h2>
            <div className="text-left sm:text-right">
              <p className="text-neutral-400 text-xs sm:text-sm">Prêmios Distribuídos</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">R$ 1.247.350</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            {/* Fade effects on sides */}
            <div className="absolute left-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-r from-neutral-800 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-l from-neutral-800 to-transparent z-10"></div>
            
            <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll-continuous">
              {[
                { name: 'João***', prize: 'R$ 500', time: '2 min' },
                { name: 'Maria***', prize: 'R$ 200', time: '5 min' },
                { name: 'Pedro***', prize: 'R$ 1.000', time: '8 min' },
                { name: 'Ana***', prize: 'R$ 100', time: '12 min' },
                { name: 'Carlos***', prize: 'R$ 300', time: '15 min' },
                { name: 'Lucia***', prize: 'R$ 750', time: '18 min' }
              ].concat([
                { name: 'João***', prize: 'R$ 500', time: '2 min' },
                { name: 'Maria***', prize: 'R$ 200', time: '5 min' },
                { name: 'Pedro***', prize: 'R$ 1.000', time: '8 min' },
                { name: 'Ana***', prize: 'R$ 100', time: '12 min' },
                { name: 'Carlos***', prize: 'R$ 300', time: '15 min' },
                { name: 'Lucia***', prize: 'R$ 750', time: '18 min' }
              ]).map((winner, index) => (
                <div key={index} className="flex-shrink-0 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-xl p-3 sm:p-4 md:p-5 w-60 sm:w-72 md:w-80 border border-neutral-600/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        {winner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-xs sm:text-sm md:text-base">{winner.name}</p>
                        <p className="text-neutral-400 text-xs">há {winner.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-base sm:text-lg md:text-xl">{winner.prize}</p>
                      <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prize Section */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center">
            Prêmios Disponíveis
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <Image
                src="/100_money.webp"
                alt="2 Mil Reais"
                width={60}
                height={45}
                className="mx-auto mb-2 drop-shadow-lg"
              />
              <p className="text-white font-semibold text-xs sm:text-sm">R$ 2.000</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <Image
                src="/100_money.webp"
                alt="Mil Reais"
                width={60}
                height={45}
                className="mx-auto mb-2 drop-shadow-lg"
              />
              <p className="text-white font-semibold text-xs sm:text-sm">R$ 1.000</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <Image
                src="/50_money.webp"
                alt="500 Reais"
                width={60}
                height={45}
                className="mx-auto mb-2 drop-shadow-lg"
              />
              <p className="text-white font-semibold text-xs sm:text-sm">R$ 500</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <Image
                src="/200_money.webp"
                alt="200 Reais"
                width={60}
                height={45}
                className="mx-auto mb-2 drop-shadow-lg"
              />
              <p className="text-white font-semibold text-xs sm:text-sm">R$ 200</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScratchCardPage;

