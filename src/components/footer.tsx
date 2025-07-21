import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

export default function Footer() {
  return (
    <footer className={`${poppins.className} bg-neutral-950 border-t border-neutral-800/50`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </h3>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
              A plataforma de raspadinhas online mais confiável do Brasil. Ganhe prêmios incríveis e dinheiro real de forma segura e divertida.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200 border border-neutral-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-neutral-300" fill="currentColor"  x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#como-funciona" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('como-funciona');
                if (element) {
                  const offsetTop = element.offsetTop - 80; // Offset para header
                  window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                  });
                }
              }} className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer">Como Funciona</a></li>
              <li><a href="#raspadinhas" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('raspadinhas');
                if (element) {
                  const offsetTop = element.offsetTop - 80; // Offset para header
                  window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                  });
                }
              }} className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer">Raspadinhas</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Depoimentos</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Central de Ajuda</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Contato</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Termos de Uso</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Privacidade</a></li>
            </ul>
          </div>
        </div>

        {/* Security Badges */}
        <div className="border-t border-neutral-800/50 pt-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 border border-neutral-600/30 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300 text-xs font-medium">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 border border-neutral-600/30 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300 text-xs font-medium">Plataforma Regulamentada</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 border border-neutral-600/30 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300 text-xs font-medium">Pagamento Seguro</span>
            </div>
          </div>
          
          {/* Made with love by Brazilians */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="text-xs">Feito com</span>
              <span className="text-red-400 text-sm">❤️</span>
              <span className="text-xs">por brasileiros</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-neutral-800/50 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-xs sm:text-sm text-center sm:text-left">
              © 2025 {process.env.NEXT_PUBLIC_APP_NAME} - Todos os direitos reservados. | CNPJ: 65.164.519/0001-50
            </p>
            <div className="flex items-center gap-4">
              <span className="text-neutral-500 text-xs">Jogue com responsabilidade</span>
              <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
              <span className="text-neutral-500 text-xs">+18 anos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}