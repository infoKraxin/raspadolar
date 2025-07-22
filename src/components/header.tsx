import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ticket, HelpCircle, User, Wallet, LogOut, Settings, ChevronDown, RefreshCw, X, CreditCard, Shield, Lock, CheckCircle, AlertCircle, Smartphone, QrCode, Copy, Timer, ArrowLeft, Users } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "@/components/auth-modal";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DepositModal from "@/components/deposit-modal";
import { getAppColor, getAppColorText } from "@/lib/colors";

export default function Header() {
    const { user, login, logout, updateUser, token } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const quickAmounts = [10, 25, 50, 100, 200, 500];

    // Estado para logo dinâmica
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoLoading, setLogoLoading] = useState(true);

    useEffect(() => {
        const fetchLogo = async () => {
            setLogoLoading(true);
            try {
                const response = await fetch('https://api.raspapixoficial.com/v1/api/setting');
                const data = await response.json();
                if (response.ok && data.data && data.data[0]?.plataform_logo) {
                    setLogoUrl(data.data[0].plataform_logo);
                } else {
                    setLogoUrl(null);
                }
            } catch (err) {
                setLogoUrl(null);
            } finally {
                setLogoLoading(false);
            }
        };
        fetchLogo();
    }, []);

    // Função para atualizar saldo do usuário
    const refreshUserBalance = async () => {
        if (!token) return;
        
        try {
            const response = await fetch('https://api.raspapixoficial.com/v1/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Atualizar o contexto de autenticação com os dados atualizados
                updateUser(data.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar saldo do usuário:', error);
        }
    };

    // Atualizar saldo periodicamente quando o usuário estiver logado
    useEffect(() => {
        if (user && token) {
            // Atualizar saldo a cada 10 segundos
            const interval = setInterval(refreshUserBalance, 10000);
            return () => clearInterval(interval);
        }
    }, [user, token]);

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

    // Funções para o modal de depósito
    const handleQuickAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount(amount.toString());
    };
    
    const handleCustomAmountChange = (value: string) => {
        const cleanValue = value.replace(/[^0-9.,]/g, '');
        setCustomAmount(cleanValue);
        setSelectedAmount(null);
    };

    const handleGeneratePayment = async () => {
        const amount = parseFloat(customAmount.replace(',', '.'));
        
        if (!amount || amount < 1) {
            toast.error('Por favor, insira um valor válido (mínimo R$ 1,00)');
            return;
        }

        if (!token) {
            toast.error('Erro de autenticação');
            return;
        }
        
        setIsGeneratingPayment(true);
        
        try {
            const response = await fetch('https://api.raspapixoficial.com/v1/api/deposits/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    paymentMethod: 'PIX',
                    gateway: 'pixup'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao gerar pagamento');
            }

            if (data.success) {
                setPaymentData(data.data);
                setShowPaymentModal(true);
                toast.success('Pagamento PIX gerado com sucesso!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao gerar pagamento PIX');
            console.error('Erro ao gerar pagamento:', error);
        } finally {
            setIsGeneratingPayment(false);
        }
    };
    
    const getCurrentAmount = () => {
        return parseFloat(customAmount.replace(',', '.')) || 0;
    };
    return (
    <div
    className="w-screen border-b bg-neutral-900 border-neutral-800">
        <div className="flex items-center justify-between mx-auto p-2 max-w-7xl">
            <div className="flex items-center gap-6">
                <a href="/">
                    {logoLoading ? (
                        <div className="w-[84px] h-[64px] bg-neutral-800 animate-pulse rounded-lg" />
                    ) : logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt="logo"
                            width={84}
                            height={64}
                            className="object-contain"
                        />
                    ) : (
                        <Image
                            src="/logo_orion.png"
                            alt="logo"
                            width={84}
                            height={64}
                            className="object-contain"
                        />
                    )}
                </a>

                
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
                        <Ticket size={18} className={`${getAppColorText()}`} />
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
                    <a href="/v1/profile?section=affiliates" onClick={(e) => {
                        e.preventDefault();
                        // Redireciona para a página de perfil com seção de afiliados
                        window.location.href = '/v1/profile?section=affiliates';
                    }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 font-medium cursor-pointer">
                        <Users size={18} className="text-neutral-600" />
                        <span>Indique & Ganhe</span>
                    </a>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    // Usuário logado
                    <>
                        <Button 
                            className={`${getAppColor ()} hover:bg-neutral-700 text-white cursor-pointer border border-neutral-600/30 px-4 py-2 h-[45px]`}
                            onClick={() => setIsDepositModalOpen(true)}
                        >
                            <Wallet size={16} className="mr-2" />
                            Depositar
                        </Button>
                        
                        <div className="relative user-menu-container">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 border border-neutral-700"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 ${getAppColor()} rounded-full flex items-center justify-center`}>
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
                                        <Wallet size={16} className={`${getAppColorText()}`} />
                                        <span className={`${getAppColorText()} font-medium`}>
                                            {user.wallet && user.wallet[0] ? 
                                                `${user.wallet[0].symbol} ${parseFloat(user.wallet[0].balance).toFixed(2)}` : 
                                                'R$ 0,00'
                                            }
                                        </span>
                                        <button
                                            onClick={refreshUserBalance}
                                            className="ml-1 p-1 rounded hover:bg-neutral-700 transition-colors"
                                            title="Atualizar saldo"
                                        >
                                            <RefreshCw size={14} className={`${getAppColorText()} hover:text-neutral-300`} />
                                        </button>
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
                                    
                                    <a
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            setIsDepositModalOpen(true);
                                        }}
                                    >
                                        <Wallet size={16} />
                                        <span>Depositar</span>
                                    </a>
                                    
                                    {user.is_admin && (
                                        <a
                                            href="/v2/administrator/dashboard"
                                            className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Settings size={16} />
                                            <span>Administrador</span>
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
                    </>
                ) : (
                    // Usuário não logado
                    <>
                        <Button 
                            variant="ghost" 
                            className="text-neutral-300 hover:text-white hover:bg-neutral-800/50 cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            Login
                        </Button>
                        <Button 
                            className={`${getAppColor()}  text-white cursor-pointer hover:bg-neutral-800/50`}
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

        {/* Deposit Modal */}
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          token={token}
          updateUser={updateUser}
        />

        {/* Payment Modal */}
        {paymentData && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-700">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Pagamento PIX</h2>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setPaymentData(null);
                                    setIsDepositModalOpen(false);
                                    setCustomAmount('');
                                    setSelectedAmount(null);
                                }}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Amount */}
                        <div className="text-center mb-6">
                            <p className="text-neutral-400 text-sm mb-1">Valor do depósito</p>
                            <p className="text-2xl font-bold text-white">
                                R$ {parseFloat(paymentData.deposit.amount).toFixed(2).replace('.', ',')}
                            </p>
                        </div>

                        {/* PIX Code */}
                        <div className="mb-6">
                            <Label className="text-white font-medium mb-3 block">
                                Código PIX (Copia e Cola)
                            </Label>
                            <div className="space-y-3">
                                <textarea
                                    value={paymentData.payment.qrCode}
                                    readOnly
                                    className="w-full h-20 p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-xs resize-none pointer-events-none select-none"
                                />
                                <Button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(paymentData.payment.qrCode);
                                            toast.success('Código PIX copiado!');
                                        } catch (error) {
                                            toast.error('Erro ao copiar código');
                                        }
                                    }}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copiar Código PIX
                                </Button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                    1
                                </div>
                                <p className="text-neutral-300 text-xs">
                                    Abra o app do seu banco e escolha a opção PIX
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                    2
                                </div>
                                <p className="text-neutral-300 text-xs">
                                    Selecione "Pix Copia e Cola" e cole o código acima
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                    3
                                </div>
                                <p className="text-neutral-300 text-xs">
                                    Confirme o pagamento e aguarde a aprovação
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                <span className="text-yellow-400 text-xs font-medium">Aguardando pagamento</span>
                            </div>
                            <p className="text-neutral-300 text-xs">
                                O saldo será creditado automaticamente após a confirmação
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    )
}