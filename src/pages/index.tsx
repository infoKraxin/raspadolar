import Image from "next/image";
import { Poppins } from "next/font/google";
import Header from "@/components/header";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import Winners from "@/components/winners";
import { getAppColor, getAppGradient, getAppColorText, getAppColorSvg, getAppColorBorder } from '@/lib/colors';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

// Tipos de dados
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
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ScratchCard[];
  count: number;
}

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [banners, setBanners] = useState<string[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);

  const maleMemojis = [
    '/memojis/male-1.png', '/memojis/male-2.png', '/memojis/male-3.png',
    '/memojis/male-4.png', '/memojis/male-5.png', '/memojis/male-6.png'
  ];

  const femaleMemojis = [
    '/memojis/female-1.png', '/memojis/female-2.png', '/memojis/female-3.png',
    '/memojis/female-4.png'
  ];

  const getMemojiByName = (name: string) => {
    const cleanName = name.replace('***', '').toLowerCase();
    const femaleNames = ['maria', 'ana', 'julia', 'carla', 'lucia', 'fernanda', 'patricia', 'sandra'];
    const isFemale = femaleNames.some(femaleName => cleanName.includes(femaleName));

    const hash = cleanName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const memojiArray = isFemale ? femaleMemojis : maleMemojis;
    return memojiArray[Math.abs(hash) % memojiArray.length];
  };

  const fixImageUrl = (url: string) => {
    if (!url) return '';
    return url
      .replace('raspa.ae', 'https://raspadinha-api.onrender.com')
      .replace('/uploads/scratchcards/', '/uploads/')
      .replace('/uploads/prizes/', '/uploads/');
  };

  const getCardType = (card: ScratchCard) => {
    const hasMoney = card.prizes.some(p => p.type === 'MONEY');
    const hasProduct = card.prizes.some(p => p.type === 'PRODUCT');
    if (hasMoney && hasProduct) return 'Misto';
    if (hasMoney) return 'Dinheiro';
    if (hasProduct) return 'Produtos';
    return 'Outros';
  };

  const getMaxPrize = (card: ScratchCard) => {
    if (!card.prizes.length) return 'Sem prêmios';
    const maxPrize = card.prizes.reduce((max, prize) => {
      const prizeValue = parseFloat(prize.value || '0');
      const maxValue = parseFloat(max.value || '0');
      return prizeValue > maxValue ? prize : max;
    });

    if (maxPrize.type === 'MONEY') {
      return `Ganhe até R$ ${parseFloat(maxPrize.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return maxPrize.product_name || maxPrize.name || 'Prêmio especial';
  };

  const getFilteredCards = () => {
    if (filter === 'all') return scratchCards;
    return scratchCards.filter(card => {
      const cardType = getCardType(card).toLowerCase();
      if (filter === 'money') return cardType === 'dinheiro' || cardType === 'misto';
      if (filter === 'products') return cardType === 'produtos' || cardType === 'misto';
      return true;
    });
  };

  const fetchScratchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/scratchcards');
      const data: ApiResponse = await response.json();
      if (data.success) {
        setScratchCards(data.data.filter(card => card.is_active));
      } else {
        setError('Erro ao carregar raspadinhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao buscar raspadinhas:', err);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO fetchUserData CORRIGIDA
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token não encontrado, usuário não está logado.');
      return;
    }

    try {
      const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/profile', { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      console.log('Resposta completa da API de perfil:', data);

      // Verificamos se a resposta foi um sucesso e se a propriedade 'balance' existe em data.data
      if (data.success && data.data && typeof data.data.balance !== 'undefined') {
        setBalance(data.data.balance);
        console.log('Saldo atualizado com sucesso:', data.data.balance);
      } else {
        console.log('Estrutura da resposta da API de perfil inesperada ou saldo não encontrado.');
        // Definir o saldo como 0 em caso de falha para evitar erros
        setBalance(0);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Definir saldo como 0 em caso de falha completa da requisição
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/setting');
        const data = await response.json();
        if (response.ok && data.data && data.data[0]) {
          const s = data.data[0];
          const arr = [s.plataform_banner, s.plataform_banner_2, s.plataform_banner_3].filter(Boolean);
          setBanners(arr.length > 0 ? arr : ['/banner_orion2.png', '/banner_orion2.png', '/banner_orion2.png']);
        } else {
          setBanners(['/banner_orion2.png', '/banner_orion2.png', '/banner_orion2.png']);
        }
      } catch {
        setBanners(['/banner_orion2.png', '/banner_orion2.png', '/banner_orion2.png']);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const totalSlides = banners.length || 3;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  useEffect(() => {
    fetchScratchCards();
  }, []);

  useEffect(() => {
    const checkAndCorrectBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Usuário não logado. Não é possível verificar o saldo.");
        return;
      }

      try {
        const response = await fetch('https://raspadinha-api.onrender.com/v1/api/users/check-unprocessed-deposits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();

        if (data.success) {
          console.log('Verificação de depósitos concluída.');
          await fetchUserData();
        } else {
          console.log('Nenhum depósito pendente de atualização encontrado.');
        }
      } catch (error) {
        console.error('Erro ao verificar depósitos não processados:', error);
      }
    };
    
    checkAndCorrectBalance();
  }, []);

  const getBadgeColor = (cardType: string) => {
    if (cardType === 'Dinheiro') return 'bg-green-500/90';
    if (cardType === 'Produtos') return 'bg-yellow-500/90';
    if (cardType === 'Misto') return 'bg-purple-500/90';
    return 'bg-yellow-500/90';
  };

  return (
    <div className={`${poppins.className}`}>
       <Header balance={balance} />

      {/* Banner Carousel */}
      <div className="bg-neutral-900 mt-4 relative w-full max-w-6xl lg:max-w-7xl mx-auto overflow-hidden px-2 sm:px-4 lg:px-0">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannersLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="w-full relative pt-[56.25%] flex-shrink-0">
                <div className="absolute inset-0 bg-neutral-800 animate-pulse rounded-lg" />
              </div>
            ))
          ) : (
            banners.map((banner, i) => (
              <div key={i} className="w-full flex-shrink-0 relative">
                <Image
                  src={banner}
                  alt={`Banner ${i + 1}`}
                  layout="responsive"
                  width={1920}
                  height={1080}
                  priority={i === 0}
                />
              </div>
            ))
          )}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: banners.length }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? `w-6 h-1.5 ${getAppColor()} rounded-full`
                  : "w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Winners Slider */}
      <div className="py-8 sm:py-12 bg-neutral-900 max-w-7xl mx-auto px-4">
        <Winners />
      </div>

      {/* Raspadinhas em Destaque */}
      {scratchCards.some(card => card.is_featured) && (
        <div className="py-8 sm:py-12 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <svg width="2em" height="2em" fill="currentColor" className={`${getAppColorText()} animate-pulse duration-700`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"></path></svg>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Em alta!
              </h2>
            </div>

            {/* Grid de Cards em Destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {scratchCards
                .filter(card => card.is_featured)
                .map((card) => {
                  const cardType = getCardType(card);
                  const maxPrize = getMaxPrize(card);

                  return (
                    <div key={card.id} className={`bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border ${getAppColorBorder()} shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8`}>
                      <div className="relative -mt-12 sm:-mt-15">
                        <Image
                          src={fixImageUrl(card.image_url) || '/scratchs/web.webp'}
                          alt={card.name}
                          width={300}
                          height={200}
                          className="w-full h-auto object-cover rounded-t-xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/scratchs/web.webp';
                          }}
                        />
                        <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${getBadgeColor(cardType)} backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                          {cardType}
                        </div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate" title={card.name}>
                          {card.name}
                        </h3>
                        <p className="text-neutral-400 text-sm mb-3 sm:mb-4 truncate" title={cardType === 'Produtos' ? card.description : maxPrize}>
                          {cardType === 'Produtos' ? card.description : maxPrize}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 font-bold text-base sm:text-lg">
                            R$ {parseFloat(card.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            onClick={() => router.push(`v1/scratch/${card.id}`)}
                            className={`${getAppGradient()} text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                          >
                            Jogar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Raspadinhas Section */}
      <div id="raspadinhas" className="py-8 sm:py-12 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Raspadinhas
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === 'all'
                    ? `${getAppGradient()} text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('money')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === 'money'
                    ? `${getAppGradient()} text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white'
                }`}
              >
                Dinheiro
              </button>
              <button
                onClick={() => setFilter('products')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === 'products'
                    ? `${getAppGradient()} text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white'
                }`}
              >
                Produtos
              </button>
            </div>
          </div>

          {/* Raspadinhas Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg pt-6 sm:pt-8 animate-pulse">
                  <div className="relative -mt-12 sm:-mt-15">
                    <div className="w-full h-48 bg-neutral-700 rounded-t-xl"></div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="h-6 bg-neutral-700 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-700 rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-neutral-700 rounded w-20"></div>
                      <div className="h-10 bg-neutral-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                  onClick={fetchScratchCards}
                  className={`${getAppGradient()} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                >
                  Tentar Novamente
                </button>
              </div>
            ) : getFilteredCards().length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-400 text-lg">Nenhuma raspadinha encontrada para este filtro.</p>
              </div>
            ) : (
              getFilteredCards().map((card) => {
                const cardType = getCardType(card);
                const maxPrize = getMaxPrize(card);

                return (
                  <div key={card.id} className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8">
                    <div className="relative -mt-12 sm:-mt-15">
                      <Image
                        src={fixImageUrl(card.image_url) || '/scratchs/sonho.webp'}
                        alt={card.name}
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover rounded-t-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/scratchs/sonho.webp';
                        }}
                      />
                      <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${getBadgeColor(cardType)} backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                        {cardType}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate" title={card.name}>
                        {card.name}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3 sm:mb-4 truncate" title={cardType === 'Produtos' ? card.description : maxPrize}>
                        {cardType === 'Produtos' ? card.description : maxPrize}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-bold text-base sm:text-lg">
                          R$ {parseFloat(card.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => router.push(`v1/scratch/${card.id}`)}
                          className={`${getAppGradient()} text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                        >
                          Jogar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Como Funciona Section */}
      <div id="como-funciona" className="py-8 sm:py-12 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
              Como Funciona
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Siga estes 4 passos simples e comece a ganhar agora mesmo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Steps Cards */}
            {[
              { num: 1, title: 'Crie sua Conta', desc: 'Cadastre-se rapidamente e faça seu primeiro depósito para começar a jogar' },
              { num: 2, title: 'Selecione uma Raspadinha', desc: 'Escolha entre diversas opções de raspadinhas com prêmios incríveis' },
              { num: 3, title: 'Jogue e Descubra', desc: 'Interaja com a raspadinha e descubra se você ganhou' },
              { num: 4, title: 'Receba seu Prêmio', desc: 'Ganhou? Receba seu prêmio instantaneamente via PIX ou retire produtos' },
            ].map((step) => (
              <div key={step.num} className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${getAppColor()} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-slate-300/40`}>
                      <span className="text-white font-bold text-lg sm:text-xl">{step.num}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


