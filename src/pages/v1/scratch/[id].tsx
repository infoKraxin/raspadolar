import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

export default function RaspadinhaPage() {
  const router = useRouter();
  const { id } = router.query;
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBackClick = () => {
    router.push('/');
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += 1;
      }
    };

    const interval = setInterval(scroll, 50);
    return () => clearInterval(interval);
  }, []);

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

          {/* Scratch Card */}
          <div className="bg-neutral-700 rounded-lg p-3 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
            <div className="relative w-64 h-64 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-lg overflow-hidden mx-auto">
              <Image
                src="/raspe_aqui.webp"
                alt="Raspe Aqui"
                fill
                className="object-contain opacity-40"
              />
              
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
            </div>
            
            <div className="text-center mt-3 sm:mt-4">
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
                💡 Clique em "Comprar e Raspar" para iniciar o jogo
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl w-full transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400/20 cursor-pointer text-sm sm:text-base">
                Comprar e Raspar (R$ 1,00)
              </Button>
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-neutral-700 rounded-lg p-3 sm:p-4 border border-neutral-600">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <p className="text-white font-semibold text-sm sm:text-base">SEU SALDO</p>
                <p className="text-green-400 text-lg sm:text-xl font-bold">R$ 0,00</p>
              </div>
              <Button className="bg-neutral-600 hover:bg-neutral-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg cursor-pointer text-xs sm:text-sm w-full sm:w-auto">
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
}