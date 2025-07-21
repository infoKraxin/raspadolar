import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ticket, HelpCircle, User, Wallet, LogOut, Settings, ChevronDown, RefreshCw, X, CreditCard, Shield, Lock, CheckCircle, AlertCircle, Smartphone, QrCode, Copy, Timer, ArrowLeft, Users } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "@/components/auth-modal";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

    // Função para atualizar saldo do usuário
    const refreshUserBalance = async () => {
        if (!token) return;
        
        try {
            const response = await fetch('https://api.raspadinha.fun/v1/api/users/profile', {
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
            const response = await fetch('https://api.raspadinha.fun/v1/api/deposits/create', {
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
                    <Image
                    src="/logo_orion.png"
                    alt="logo"
                    width={84}
                    height={64}
                    />
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
                        <Ticket size={18} className="text-yellow-400" />
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
                            className="bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer border border-yellow-600/30 px-4 py-2 h-[45px]"
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
                                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
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
                                        <Wallet size={16} className="text-yellow-400" />
                                        <span className="text-yellow-400 font-medium">
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
                                            <RefreshCw size={14} className="text-yellow-400 hover:text-yellow-300" />
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
                                        href="/v1/profile/deposit"
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Wallet size={16} />
                                        <span>Depositar</span>
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
                    </>
                ) : (
                    // Usuário não logado
                    <>
                        <Button 
                            variant="ghost" 
                            className="text-neutral-300 hover:text-white hover:bg-yellow-700 cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            Login
                        </Button>
                        <Button 
                            className="bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer"
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
        {isDepositModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-700 max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Fazer Depósito</h2>
                            <button
                                onClick={() => {
                                    setIsDepositModalOpen(false);
                                    setCustomAmount('');
                                    setSelectedAmount(null);
                                }}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Amount Selection */}
                        <div className="space-y-6">
                            {/* Quick Amounts */}
                            <div>
                                <Label className="text-white font-medium mb-3 block">
                                    Valores Rápidos
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {quickAmounts.map((amount) => {
                                        const isPopular = [25, 50, 100].includes(amount);
                                        return (
                                            <button
                                                key={amount}
                                                onClick={() => handleQuickAmountSelect(amount)}
                                                className={`p-3 rounded-lg border transition-all duration-300 relative ${
                                                    selectedAmount === amount
                                                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                                        : 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600 hover:border-neutral-500'
                                                }`}
                                            >
                                                {isPopular && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-500/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-yellow-400/30">
                                                        POPULAR
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold">R$ {amount}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Custom Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="customAmount" className="text-white font-medium">
                                    Ou digite o valor desejado
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 font-medium">
                                        R$
                                    </span>
                                    <Input
                                        id="customAmount"
                                        type="text"
                                        placeholder="0,00"
                                        value={customAmount}
                                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                                        className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-yellow-500 focus:ring-yellow-500/20"
                                    />
                                </div>
                                <p className="text-neutral-500 text-sm">
                                    Valor mínimo: R$ 1,00
                                </p>
                            </div>

                            {/* Payment Method */}
                            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <Smartphone className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">PIX</h3>
                                        <p className="text-yellow-400 text-xs">Aprovação instantânea</p>
                                    </div>
                                    <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                                </div>
                                <p className="text-neutral-300 text-xs">
                                    Pagamento processado automaticamente em até 2 minutos
                                </p>
                            </div>

                            {/* Generate Payment Button */}
                            <Button
                                onClick={handleGeneratePayment}
                                disabled={!customAmount || getCurrentAmount() < 1 || isGeneratingPayment}
                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20 disabled:border-neutral-600/20"
                            >
                                {isGeneratingPayment ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Gerando Pagamento...
                                    </div>
                                ) : (
                                    `Gerar Pagamento PIX - R$ ${getCurrentAmount().toFixed(2).replace('.', ',')}`
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

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