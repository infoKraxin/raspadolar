import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ticket, HelpCircle, User, Wallet, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "@/components/auth-modal";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const { user, login, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Fechar menu do usuário ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isUserMenuOpen && !target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        toast.success('Logout realizado com sucesso!');
        window.location.reload();
    };

    const handleAuthSuccess = (userData: any, token: string) => {
        login(userData, token);
        setIsAuthModalOpen(false);
    };
    return (
    <div
    className="w-screen border-b bg-neutral-900 border-neutral-800">
        <div className="flex items-center justify-between mx-auto p-2 max-w-5xl">
            <div className="flex items-center gap-6">
                <Image
                src="/logo_rs.png"
                alt="logo"
                width={64}
                height={64}
                />
                
                <nav className=" items-center gap-2 hidden md:flex">
                    <a href="#raspadinhas" onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('raspadinhas');
                        if (element) {
                            const offsetTop = element.offsetTop - 80; // Offset para header
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        } else {
                            // Se não estiver na página inicial, redireciona para lá
                            window.location.href = '/#raspadinhas';
                        }
                    }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 font-medium cursor-pointer">
                        <Ticket size={18} className="text-blue-400" />
                        <span>Raspadinhas</span>
                    </a>
                    <a href="#como-funciona" onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('como-funciona');
                        if (element) {
                            const offsetTop = element.offsetTop - 80; // Offset para header
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        } else {
                            // Se não estiver na página inicial, redireciona para lá
                            window.location.href = '/#como-funciona';
                        }
                    }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 font-medium cursor-pointer">
                        <HelpCircle size={18} className="text-neutral-600" />
                        <span>Como Funciona</span>
                    </a>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    // Usuário logado
                    <div className="relative user-menu-container">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 border border-neutral-700"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-white text-sm font-medium">{user.full_name}</p>
                                    <p className="text-neutral-400 text-xs">
                                        {user.wallet && user.wallet[0] ? 
                                            `${user.wallet[0].symbol} ${parseFloat(user.wallet[0].balance).toFixed(2)}` : 
                                            'R$ 0,00'
                                        }
                                    </p>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-neutral-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50">
                                <div className="p-4 border-b border-neutral-700">
                                    <p className="text-white font-medium">{user.full_name}</p>
                                    <p className="text-neutral-400 text-sm">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Wallet size={16} className="text-blue-400" />
                                        <span className="text-blue-400 font-medium">
                                            {user.wallet && user.wallet[0] ? 
                                                `${user.wallet[0].symbol} ${parseFloat(user.wallet[0].balance).toFixed(2)}` : 
                                                'R$ 0,00'
                                            }
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-2">
                                    <a
                                        href="/v1/profile"
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <User size={16} />
                                        <span>Meu Perfil</span>
                                    </a>
                                    
                                    {user.is_admin && (
                                        <a
                                            href="/v2/administrator"
                                            className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Settings size={16} />
                                            <span>Painel Admin</span>
                                        </a>
                                    )}
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Usuário não logado
                    <>
                        <Button 
                            variant="ghost" 
                            className="text-neutral-300 hover:text-white hover:bg-blue-700 cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            Login
                        </Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            Registrar
                        </Button>
                    </>
                )}
            </div>
        </div>
        
        {/* Auth Modal */}
        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)}
            onAuthSuccess={handleAuthSuccess}
        />
    </div>
    )
}