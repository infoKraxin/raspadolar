import Image from "next/image";
import { Poppins } from "next/font/google";
import Header from "@/components/header";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3; // Simulando 3 slides com a mesma imagem

  // Arrays de memojis por gênero
  const maleMemojis = [
    '/memojis/male-1.png',
    '/memojis/male-2.png',
    '/memojis/male-3.png',
    '/memojis/male-4.png',
    '/memojis/male-5.png',
    '/memojis/male-6.png'
  ];

  const femaleMemojis = [
    '/memojis/female-1.png',
    '/memojis/female-2.png',
    '/memojis/female-3.png',
    '/memojis/female-4.png'
  ];

  // Função para identificar gênero pelo nome e retornar memoji fixo
  const getMemojiByName = (name: string) => {
    const cleanName = name.replace('***', '').toLowerCase();
    
    // Nomes femininos comuns
    const femaleNames = ['maria', 'ana', 'julia', 'carla', 'lucia', 'fernanda', 'patricia', 'sandra'];
    
    // Verifica se é nome feminino
    const isFemale = femaleNames.some(femaleName => cleanName.includes(femaleName));
    
    if (isFemale) {
      // Usa hash do nome para sempre retornar o mesmo memoji feminino
      const hash = cleanName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return femaleMemojis[Math.abs(hash) % femaleMemojis.length];
    } else {
      // Usa hash do nome para sempre retornar o mesmo memoji masculino
      const hash = cleanName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return maleMemojis[Math.abs(hash) % maleMemojis.length];
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Troca a cada 4 segundos

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
  <div 
  className={`${poppins.className} `}>
    <Header/>
    
    {/* Banner Carousel */}
    <div className="bg-neutral-900 mt-4 relative w-full max-w-5xl mx-auto h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden px-2 sm:px-4 lg:px-0">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full "
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Slide 1 */}
        <div className="w-full h-full flex-shrink-0 relative">
          <Image
            src="/banner.webp"
            alt="Banner 1"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Slide 2 */}
        <div className="w-full h-full flex-shrink-0 relative">
          <Image
            src="/banner.webp"
            alt="Banner 2"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Slide 3 */}
        <div className="w-full h-full flex-shrink-0 relative">
          <Image
            src="/banner.webp"
            alt="Banner 3"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-6 h-1.5 bg-blue-500 rounded-full" // Ponto ativo alongado azul
                : "w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/70" // Pontos inativos menores
            }`}
          />
        ))}
      </div>
    </div>

    {/* Winners Slider */}
    <div className="py-8 sm:py-12 bg-neutral-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Últimos Ganhadores
          </h2>
          <div className="text-left sm:text-right">
            <p className="text-neutral-400 text-sm">Prêmios Distribuídos</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400">R$ 1.247.350</p>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Fade effects on sides */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-neutral-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-neutral-900 to-transparent z-10"></div>
          
          <div className="flex gap-4 sm:gap-6 animate-scroll-continuous">
            {/* Winner Card 1 */}
            <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                        src={getMemojiByName('***carlos')}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">***carlos</p>
                    <p className="text-neutral-400 text-xs sm:text-sm">há 2 min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 50</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                </div>
              </div>
            </div>

            {/* Winner Card 2 */}
            <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                        src={getMemojiByName('***maria')}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">***maria</p>
                    <p className="text-neutral-400 text-xs sm:text-sm">há 5 min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 100</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                </div>
              </div>
            </div>

            {/* Winner Card 3 */}
            <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                        src={getMemojiByName('***joao')}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">***joao</p>
                    <p className="text-neutral-400 text-xs sm:text-sm">há 8 min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm sm:text-lg">Apple Watch</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wide">PRODUTO</p>
                </div>
              </div>
            </div>

            {/* Winner Card 4 */}
            <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                        src={getMemojiByName('***ana')}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">***ana</p>
                    <p className="text-neutral-400 text-xs sm:text-sm">há 12 min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 200</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                </div>
              </div>
            </div>

            {/* Duplicate all cards for seamless infinite scroll */}
             <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                     <Image
                       src={getMemojiByName('***carlos')}
                       alt="Avatar"
                       width={48}
                       height={48}
                       className="object-cover"
                     />
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm sm:text-base">***carlos</p>
                     <p className="text-neutral-400 text-xs sm:text-sm">há 2 min</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 50</p>
                   <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                 </div>
               </div>
             </div>

             <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                     <Image
                       src={getMemojiByName('***maria')}
                       alt="Avatar"
                       width={48}
                       height={48}
                       className="object-cover"
                     />
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm sm:text-base">***maria</p>
                     <p className="text-neutral-400 text-xs sm:text-sm">há 5 min</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 100</p>
                   <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                 </div>
               </div>
             </div>

             <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                     <Image
                       src={getMemojiByName('***joao')}
                       alt="Avatar"
                       width={48}
                       height={48}
                       className="object-cover"
                     />
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm sm:text-base">***joao</p>
                     <p className="text-neutral-400 text-xs sm:text-sm">há 8 min</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-green-400 font-bold text-sm sm:text-lg">Apple Watch</p>
                   <p className="text-neutral-500 text-xs uppercase tracking-wide">PRODUTO</p>
                 </div>
               </div>
             </div>

             <div className="flex-shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 sm:p-5 w-72 sm:w-80 border border-neutral-700/50 shadow-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                     <Image
                       src={getMemojiByName('***ana')}
                       alt="Avatar"
                       width={48}
                       height={48}
                       className="object-cover"
                     />
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm sm:text-base">***ana</p>
                     <p className="text-neutral-400 text-xs sm:text-sm">há 12 min</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-green-400 font-bold text-lg sm:text-xl">R$ 200</p>
                   <p className="text-neutral-500 text-xs uppercase tracking-wide">PIX</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    {/* Raspadinhas Section */}
    <div id="raspadinhas" className="py-8 sm:py-12 bg-neutral-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Raspadinhas
          </h2>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-400/20 text-sm sm:text-base flex-1 sm:flex-none">
              Todos
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 rounded-full font-medium hover:from-neutral-600 hover:to-neutral-700 hover:text-white transition-all duration-200 shadow-lg border border-neutral-600/30 text-sm sm:text-base flex-1 sm:flex-none">
              Dinheiro
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 rounded-full font-medium hover:from-neutral-600 hover:to-neutral-700 hover:text-white transition-all duration-200 shadow-lg border border-neutral-600/30 text-sm sm:text-base flex-1 sm:flex-none">
              Produtos
            </button>
          </div>
        </div>
        
        {/* Scratch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* PIX Scratch Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8">
            <div className="relative -mt-12 sm:-mt-15">
              <Image
                src="/scratchs/pix_conta.webp"
                alt="PIX Scratch"
                width={300}
                height={200}
                className="w-full h-auto object-cover "
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg">
                Dinheiro
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Raspadinha PIX</h3>
              <p className="text-neutral-400 text-sm mb-3 sm:mb-4">Ganhe até R$ 1.000</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-base sm:text-lg">R$ 5,00</span>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Jogar
                </button>
              </div>
            </div>
          </div>          {/* Shopee Scratch Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8">
            <div className="relative -mt-12 sm:-mt-15">
              <Image
                src="/scratchs/shopee.webp"
                alt="Shopee Scratch"
                width={300}
                height={200}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-orange-500/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg">
                Vale
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Vale Shopee</h3>
              <p className="text-neutral-400 text-sm mb-3 sm:mb-4">Vale compras até R$ 500</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-base sm:text-lg">R$ 3,00</span>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Jogar
                </button>
              </div>
            </div>
          </div>

          {/* Motorizado Scratch Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8">
            <div className="relative -mt-12 sm:-mt-15">
              <Image
                src="/scratchs/motorizado.webp"
                alt="Motorizado Scratch"
                width={300}
                height={200}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg">
                Moto
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Motorizado</h3>
              <p className="text-neutral-400 text-sm mb-3 sm:mb-4">Ganhe uma moto 0km</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-base sm:text-lg">R$ 10,00</span>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Jogar
                </button>
              </div>
            </div>
          </div>

          {/* Sonho Scratch Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8">
            <div className="relative -mt-12 sm:-mt-15">
              <Image
                src="/scratchs/sonho.webp"
                alt="Sonho Scratch"
                width={300}
                height={200}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-yellow-500/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg">
                Produtos
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Realize o Sonho</h3>
              <p className="text-neutral-400 text-sm mb-3 sm:mb-4">Prêmio de até R$ 50.000</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-base sm:text-lg">R$ 15,00</span>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Jogar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Como Funciona Section */}
    <div id="como-funciona" className="py-8 sm:py-12 bg-neutral-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
            Como Funciona
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Siga estes 4 passos simples e comece a ganhar agora mesmo
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Step 1 Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
             <div className="flex items-start gap-4 sm:gap-6">
               <div className="relative flex-shrink-0">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-slate-300/40">
                    <span className="text-white font-bold text-lg sm:text-xl">1</span>
                  </div>
               </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                  Crie sua Conta
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Cadastre-se rapidamente e faça seu primeiro depósito para começar a jogar
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
             <div className="flex items-start gap-4 sm:gap-6">
               <div className="relative flex-shrink-0">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-zinc-400 to-zinc-500 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-zinc-300/40">
                    <span className="text-white font-bold text-lg sm:text-xl">2</span>
                  </div>
               </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                  Selecione uma Raspadinha
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Escolha entre diversas opções de raspadinhas com prêmios incríveis
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
             <div className="flex items-start gap-4 sm:gap-6">
               <div className="relative flex-shrink-0">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-stone-400 to-stone-500 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-stone-300/40">
                    <span className="text-white font-bold text-lg sm:text-xl">3</span>
                  </div>
               </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                  Resgate seu Prêmio
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Ganhou? Resgate seu produto ou troque pelo valor em dinheiro
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 Card */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
             <div className="flex items-start gap-4 sm:gap-6">
               <div className="relative flex-shrink-0">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-gray-200/40">
                    <span className="text-gray-800 font-bold text-lg sm:text-xl">4</span>
                  </div>
               </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                  Receba e Lucre
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Receba seus prêmios e continue jogando para lucrar ainda mais
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-blue-400/20">
            Começar Agora
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}
