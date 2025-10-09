import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Loader2, Trophy } from 'lucide-react';
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'; // Removido para simplificação do ambiente.

/* =========================================================================
 * MOCKS E COMPONENTES AUXILIARES (Para rodar em ambiente isolado)
 * ========================================================================= */

// MOCK: Componente Button (substitui '@/components/ui/button')
const Button = ({ children, className = '', disabled, ...props }) => (
    <button
        className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

// MOCK: Componente Checkbox (substitui '@/components/ui/checkbox')
const Checkbox = ({ id, className = '', ...props }) => (
    <input type="checkbox" id={id} className={`form-checkbox h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-indigo-500 focus:ring-indigo-500 ${className}`} {...props} />
);

// MOCK: Funções de cores (substitui '@/lib/colors')
const getAppColor = () => 'bg-indigo-500 hover:bg-indigo-600';
const getAppGradient = () => 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700';

// MOCK: Hook de Autenticação (substitui '@/contexts/AuthContext')
const useAuth = () => ({
    login: (user, token) => console.log("MOCK AUTH: Usuário logado e token recebido."),
});

// MOCK: Biblioteca de Toast (Feedback Visual)
const toast = {
    success: (message) => console.log("TOAST SUCESSO:", message),
    error: (message) => console.error("TOAST ERRO:", message),
};

// ========================================================================
// NOVO COMPONENTE: MODAL DE BÔNUS (RegistrationBonusModal.jsx integrado)
// ========================================================================

const RegistrationBonusModal = ({ isOpen, onClose, appGradient }) => {
    // Não renderiza se não estiver aberto
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-sm w-full mx-auto border border-neutral-700 overflow-hidden transform scale-100 transition-transform duration-300">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* Header/Title - Utiliza o appGradient */}
                <div className={`p-6 ${appGradient} text-white text-center`}>
                    <Trophy size={48} className="mx-auto mb-2 drop-shadow-lg" />
                    <h3 className="text-3xl font-extrabold leading-tight">
                        🎉 BÔNUS EXCLUSIVO!
                    </h3>
                    <p className="text-sm font-medium opacity-90 mt-1">
                        Sua conta foi criada com sucesso!
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 text-center text-white">
                    <p className="text-5xl font-black mb-4 text-yellow-400 drop-shadow-xl">
                        R$ 3.000
                    </p>
                    <p className="text-neutral-300 mb-6 text-base">
                        É seu bônus de boas-vindas para **jogar grátis**! Aproveite a chance de triplicar sua banca.
                    </p>

                    <Button
                        onClick={onClose}
                        className={`w-full ${appGradient} text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01]`}
                    >
                        ATIVAR MEU BÔNUS AGORA
                    </Button>

                    <p className="mt-4 text-xs text-neutral-500">
                        *O bônus será aplicado automaticamente no seu primeiro depósito.
                    </p>
                </div>
            </div>
        </div>
    );
};


// ========================================================================
// COMPONENTE PRINCIPAL: AuthModal
// ========================================================================

const AuthModal = ({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) => {
    const { login } = useAuth();
    // const router = useRouter(); // MOCK: substitui por console.log/window.location

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showBonusModal, setShowBonusModal] = useState(false); // NOVO: Estado para o modal de bônus

    // Estado do formulário
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        cpf: '',
    });

    // Efeito para buscar código de referência da URL (MOCK)
    const [referralCode, setReferralCode] = useState('');
    useEffect(() => {
        // MOCK: Simula a busca do código de referência da URL (se existir)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('ref') || urlParams.get('referral');
        if (code) {
            setReferralCode(code);
            console.log(`Código de Referência detectado: ${code}`);
        }
    }, []);


    // Lógica para formatação (Phone e CPF)
    const formatPhone = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        if (value.length > 9) value = `${value.substring(0, 10)}-${value.substring(10, 14)}`;

        return value;
    };

    const formatCPF = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 3) value = `${value.substring(0, 3)}.${value.substring(3)}`;
        if (value.length > 7) value = `${value.substring(0, 7)}.${value.substring(7)}`;
        if (value.length > 11) value = `${value.substring(0, 11)}-${value.substring(11, 13)}`;

        return value;
    };

    // Handler genérico de input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            setFormData({ ...formData, [name]: formatPhone(value) });
        } else if (name === 'cpf') {
            setFormData({ ...formData, [name]: formatCPF(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Efeito para lidar com o scroll do corpo (simulação)
    useEffect(() => {
        if (isOpen || showBonusModal) {
             // disableBodyScroll(document.body); // Simulação de body scroll lock
             document.body.style.overflow = 'hidden';
        } else {
             // enableBodyScroll(document.body); // Simulação de body scroll unlock
             document.body.style.overflow = '';
        }

        // Cleanup
        return () => {
             // enableBodyScroll(document.body);
             document.body.style.overflow = '';
        };
    }, [isOpen, showBonusModal]);


    // ========================================================================
    // Lógica de Submissão de Formulário (Login e Registro)
    // ========================================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (activeTab === 'login') {
                await handleLogin();
            } else {
                await handleRegister();
            }
        } catch (error) {
            toast.error(error.message || 'Ocorreu um erro inesperado.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        // MOCK: Simulação de Login
        const loginData = {
            email: formData.email,
            password: formData.password,
        };

        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        if (loginData.email === 'teste@exemplo.com' && loginData.password === '123456') {
            const mockUser = { id: 1, email: loginData.email, name: 'Usuário Teste' };
            const mockToken = 'mock-jwt-token-for-user';
            
            login(mockUser, mockToken);
            onClose();
            toast.success('Login efetuado com sucesso!');
            if (onAuthSuccess) {
                onAuthSuccess(mockUser, mockToken);
            }
            // Não mostra o bônus no login
        } else {
            throw new Error('E-mail ou senha incorretos. Tente novamente.');
        }
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            throw new Error('As senhas não coincidem.');
        }

        // MOCK: Simulação de Registro (com dados filtrados)
        const registerData = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone.replace(/\D/g, ''),
            document: formData.cpf.replace(/\D/g, ''),
            referralCode: referralCode // Envia o código capturado
        };

        // Simulação de chamada de API de Registro
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulação de Resposta de Sucesso
        const mockUser = { id: 2, email: registerData.email, name: registerData.name };
        const mockToken = 'mock-jwt-token-for-new-user';

        if (mockToken && mockUser) {
            // 1. Loga o usuário
            login(mockUser, mockToken);
            
            // 2. Fecha o modal de autenticação (Importante!)
            onClose();
            
            // 3. Aciona o modal de bônus (Isto é o que fará ele aparecer)
            setShowBonusModal(true);
            
            // Mostra o toast de sucesso 
            toast.success('Conta criada com sucesso!');
            
            if (onAuthSuccess) {
                onAuthSuccess(mockUser, mockToken);
            }
        } else {
            throw new Error('Resposta inesperada do servidor após o registro.');
        }
    };

    // --- NOVO: Lidar com o fechamento do modal de bônus ---
    const handleBonusModalClose = () => {
        setShowBonusModal(false);
        
        // Simulação de Redirecionamento (Substituindo router.push)
        console.log("REDIRECIONAMENTO: Usuário seria enviado para /depositar");
        // window.location.href = '/depositar'; // Você usaria isso em um ambiente real
    };

    // Renderiza o modal de bônus SE o modal principal não estiver aberto
    // e o estado showBonusModal estiver ativo.
    if (showBonusModal) {
        return (
            <RegistrationBonusModal 
                isOpen={showBonusModal} 
                onClose={handleBonusModalClose} 
                appGradient={getAppGradient()} 
            />
        );
    }

    // Renderiza o modal principal (sai daqui se isOpen for false)
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-neutral-700">
                <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
                    
                    {/* Left Side - Banner Image */}
                    <div className="hidden md:flex md:w-1/2 relative min-h-[500px]">
                        {/* Substitui <Image> por <img> simples devido à falha de compilação */}
                        <img 
                            src="https://via.placeholder.com/600x800.png?text=BANNERS+DE+OFERTA" // Use sua imagem real aqui
                            alt="Banner de Boas-Vindas" 
                            className="object-cover object-center w-full h-full absolute inset-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 to-neutral-900/20" /> 
                    </div>

                    {/* Right Side - Forms */}
                    <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col min-h-[400px] md:min-h-[500px] justify-between">
                        
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent mb-2">
                                {activeTab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                            </h2>
                            <p className="text-neutral-400 text-sm">
                                {activeTab === 'login' 
                                    ? 'Entre na sua conta e continue jogando' 
                                    : 'Registre-se e comece a ganhar prêmios reais'
                                }
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex mb-6 bg-neutral-800/50 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'login'
                                        ? `${getAppColor()} text-white shadow-lg`
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'register'
                                        ? `${getAppColor()} text-white shadow-lg`
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Registrar
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
                            {activeTab === 'register' && (
                                <>
                                    {/* Name Field */}
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Nome completo"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Telefone (ex: (11) 98765-4321)"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            maxLength={15}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* CPF Field */}
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                        <input
                                            type="text"
                                            name="cpf"
                                            placeholder="CPF (ex: 123.456.789-00)"
                                            value={formData.cpf}
                                            onChange={handleInputChange}
                                            maxLength={14}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Email Field (Ambos) */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Field (Ambos) */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Confirm Password Field (somente para register) */}
                            {activeTab === 'register' && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirmar senha"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all duration-200 outline-none"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            )}

                            {/* Remember me / Forgot password (somente para login) */}
                            {activeTab === 'login' && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
                                        <Checkbox id="remember" />
                                        Lembrar de mim
                                    </label>
                                    <button
                                        type="button"
                                        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            )}

                            {/* Terms (somente para register) */}
                            {activeTab === 'register' && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Checkbox id="terms" required className="mt-0.5" />
                                    <label htmlFor="terms" className="text-neutral-400 cursor-pointer">
                                        Concordo com os{' '}
                                        <button type="button" className="text-neutral-400 hover:text-white underline cursor-pointer">
                                            Termos de Serviço
                                        </button>
                                        {' '}e que sou maior de 18 anos.
                                    </label>
                                </div>
                            )}

                            {/* Submission Button */}
                            <Button
                                type="submit"
                                className={`w-full py-3 mt-6 text-white text-lg font-bold rounded-xl transition-all duration-300 ${getAppGradient()} shadow-xl hover:shadow-2xl hover:scale-[1.005]`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin mr-2 inline-block" />
                                        {activeTab === 'login' ? 'Entrando...' : 'Registrando...'}
                                    </>
                                ) : (
                                    activeTab === 'login' ? 'ENTRAR AGORA' : 'CRIAR CONTA'
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-auto pt-6 text-center text-sm text-neutral-500">
                            {activeTab === 'register' 
                                ? 'Já tem conta? ' 
                                : 'Não tem conta? '
                            }
                            <button 
                                type="button" 
                                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')} 
                                className={`font-semibold underline ${getAppColor().replace('bg-', 'text-').replace('hover:bg-', 'hover:text-')}`}
                            >
                                {activeTab === 'register' ? 'Faça Login' : 'Registre-se'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
