import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

export default function Footer() {
  return (
    <footer className={`${poppins.className} bg-neutral-950 border-t border-neutral-800/50`}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                raspa.ae
              </h3>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
              A plataforma de raspadinhas online mais confiável do Brasil. Ganhe prêmios incríveis e dinheiro real de forma segura e divertida.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200 border border-neutral-600/30">
                <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200 border border-neutral-600/30">
                <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200 border border-neutral-600/30">
                <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
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
              © 2024 raspa.ae - Todos os direitos reservados. | CNPJ: 00.000.000/0001-00
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