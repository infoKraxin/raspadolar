import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Smartphone, CheckCircle, Copy, Timer } from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { getAppColor, getAppColorText, getAppColorBorder, getAppColorSvg, getAppGradient } from '@/lib/colors';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  updateUser: (data: any) => void;
}

const quickAmounts = [10, 20, 40, 80, 100, 200];

function PaymentModal({ isOpen, onClose, paymentData, token }: { isOpen: boolean; onClose: () => void; paymentData: any; token: string | null }) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const prevIsOpenRef = useRef(false);
  const [isPaymentPaid, setIsPaymentPaid] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let statusCheckTimer: NodeJS.Timeout | null = null;
    
    // Só reinicia o timer se o modal foi fechado e agora está aberto
    if (isOpen && !prevIsOpenRef.current) {
      setTimeLeft(900);
      setIsPaymentPaid(false);
    }
    prevIsOpenRef.current = isOpen;
    
    if (isOpen) {
      // Timer para contagem regressiva
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            toast.error('Tempo para pagamento expirado');
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Verificação imediata do status
      const checkStatus = async () => {
        try {
          // Tentar diferentes possíveis localizações do ID
          const paymentId = paymentData.payment?.id || paymentData.id || paymentData.deposit?.id;
          const response = await fetch(`https://api.raspapixoficial.com/v1/api/deposits/${paymentId}/status`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          
          if (response.ok && data.success && data.data.status === 'PAID' && !isPaymentPaid) {
            setIsPaymentPaid(true);
            toast.success('Pagamento aprovado! Seu saldo foi creditado com sucesso.');
            
            // Fecha o modal após 5 segundos
            setTimeout(() => {
              onClose();
            }, 5000);
          }
        } catch (error) {
          console.error('Erro ao verificar status do pagamento:', error);
        }
      };

      // Verificação imediata
      checkStatus();
      
      // Timer para verificar status do pagamento a cada 5 segundos
      statusCheckTimer = setInterval(checkStatus, 5000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (statusCheckTimer) clearInterval(statusCheckTimer);
    };
  }, [isOpen, onClose, paymentData, token, isPaymentPaid]);

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.payment.qrCode);
      toast.success('Código PIX copiado!');
    } catch (error) {
      toast.error('Erro ao copiar código');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md border border-neutral-700 max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Pagamento PIX</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Amount */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-neutral-400 text-xs sm:text-sm mb-1">Valor do depósito</p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              R$ {parseFloat(paymentData.deposit.amount).toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs sm:text-sm font-medium">
              Expira em: {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code PIX */}
          <div className="flex flex-col items-center mb-3 sm:mb-4">
            <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] flex items-center justify-center">
              <QRCodeCanvas value={paymentData.payment.qrCode} size={140} bgColor="#18181b" fgColor={getAppColorSvg()} includeMargin={true} />
            </div>
            <span className="text-neutral-400 text-xs mt-2">Escaneie o QR Code com o app do seu banco</span>
          </div>

          {/* PIX Code */}
          <div className="mb-4 sm:mb-6">
            <Label className="text-white font-medium mb-2 sm:mb-3 block">
              Código PIX (Copia e Cola)
            </Label>
            <div className="space-y-2 sm:space-y-3">
              <textarea
                value={paymentData.payment.qrCode}
                readOnly
                className="w-full h-16 sm:h-24 p-2 sm:p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-xs resize-none pointer-events-none select-none"
              />
              <Button
                onClick={copyPixCode}
                className={`${getAppGradient()} w-full text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                <Copy className="w-4 h-4" />
                Copiar Código PIX
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 ${getAppColor()} rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                1
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm">
                Abra o app do seu banco e escolha a opção PIX
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 ${getAppColor()} rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                2
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm">
                Selecione "Pix Copia e Cola" e cole o código acima
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 ${getAppColor()} rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                3
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm">
                Confirme o pagamento e aguarde a aprovação
              </p>
            </div>
          </div>

          {/* Status */}
          <div className={`p-3 sm:p-4 ${isPaymentPaid ? 'bg-green-500/10 border-green-500/20' : 'bg-neutral-700/20 border-neutral-400/20'} rounded-lg border`}>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className={`w-2 h-2 ${isPaymentPaid ? 'bg-green-400' : getAppColor()} rounded-full ${isPaymentPaid ? '' : 'animate-pulse'}`} />
              <span className={`${isPaymentPaid ? 'text-green-400' : getAppColorText()} text-xs sm:text-sm font-medium`}>
                {isPaymentPaid ? 'Pagamento aprovado!' : 'Aguardando pagamento'}
              </span>
            </div>
            <p className="text-neutral-300 text-xs">
              {isPaymentPaid 
                ? 'Seu saldo foi creditado com sucesso. O modal será fechado automaticamente.'
                : 'O saldo será creditado automaticamente após a confirmação do pagamento'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DepositModal({ isOpen, onClose, token }: DepositModalProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [depositBannerUrl, setDepositBannerUrl] = useState<string | null>(null);
  const [depositBannerLoading, setDepositBannerLoading] = useState(true);

  const handleQuickAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setDepositBannerLoading(true);
      try {
        const response = await fetch('https://api.raspapixoficial.com/v1/api/setting');
        const data = await response.json();
        if (response.ok && data.data && data.data[0]?.deposit_banner) {
          setDepositBannerUrl(data.data[0].deposit_banner);
        } else {
          setDepositBannerUrl(null);
        }
      } catch (error) {
        console.error('Erro ao buscar banner de depósito:', error);
        setDepositBannerUrl(null);
      } finally {
        setDepositBannerLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleCustomAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    setCustomAmount(cleanValue);
    setSelectedAmount(null);
  };

  const getCurrentAmount = () => {
    return parseFloat(customAmount.replace(',', '.')) || 0;
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
          gateway: 'pluggou'
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

  const handleCloseAll = () => {
    setCustomAmount('');
    setSelectedAmount(null);
    setPaymentData(null);
    setShowPaymentModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-2">
        <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl border border-neutral-700 max-h-[95vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">Fazer Depósito</h2>
              <button
                onClick={handleCloseAll}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Background Image */}
            <div className="relative mb-4 sm:mb-6">
              {depositBannerLoading ? (
                <div className="w-full h-32 sm:h-40 bg-neutral-800 animate-pulse rounded-lg" />
              ) : depositBannerUrl ? (
                <img 
                  src={depositBannerUrl} 
                  alt="Depósito" 
                  className="w-full h-32 sm:h-40 object-cover rounded-lg"
                />
              ) : (
                <img 
                  src="/deposit_bg.jpg" 
                  alt="Depósito" 
                  className="w-full h-32 sm:h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Amount Selection */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Amounts */}
              <div>
                <Label className="text-white font-medium mb-2 sm:mb-3 block">
                  Valores Rápidos
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {quickAmounts.map((amount) => {
                    // Definir badges para diferentes valores
                    let badge = null;
                    if (amount === 20) {
                      badge = { text: 'Popular', color: getAppColor() };
                    } else if (amount === 40) {
                      badge = { text: '✨ Recomendado', color: getAppColor() };
                    } else if (amount === 80) {
                      badge = { text: '+Querido', color: getAppColor() };
                    } else if (amount === 100) {
                    badge = { text: '+Chances', color: getAppColor() };
                  }
                    
                    return (
                      <button
                        key={amount}
                        onClick={() => handleQuickAmountSelect(amount)}
                        className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 relative ${
                          selectedAmount === amount
                            ? `${getAppGradient()} border-neutral-400/30 text-white`
                            : 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600 hover:border-neutral-500'
                        }`}
                      >
                        {badge && (
                          <div className={`absolute -top-1 -right-1 ${badge.color} backdrop-blur-sm text-white text-[7px] sm:text-[10px] px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full font-bold border border-neutral-400/30`}>
                            {badge.text}
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-xs sm:text-sm font-semibold">R$ {amount}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-1 sm:space-y-2">
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
                    className="pl-8 sm:pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-yellow-500 focus:ring-yellow-500/20 text-sm sm:text-base"
                  />
                </div>
                <p className="text-neutral-500 text-xs sm:text-sm">
                  Valor mínimo: R$ 1,00
                </p>
              </div>

              {/* Payment Method */}
              <div className={`p-3 sm:p-4 bg-neutral-700/20 rounded-lg border border-neutral-400/20`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 ${getAppColor()} rounded-lg flex items-center justify-center`}>
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xs sm:text-sm">PIX</h3>
                    <p className="text-yellow-400 text-[10px] sm:text-xs">Aprovação instantânea</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                </div>
                <p className="text-neutral-300 text-[10px] sm:text-xs">
                  Pagamento processado automaticamente em até 2 minutos
                </p>
              </div>

              {/* Generate Payment Button */}
              <Button
                onClick={handleGeneratePayment}
                disabled={!customAmount || getCurrentAmount() < 1 || isGeneratingPayment}
                className={`${getAppGradient()} w-full text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-neutral-400/20 disabled:border-neutral-600/20 text-sm sm:text-base`}
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
      {/* Payment Modal */}
      {paymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleCloseAll}
          paymentData={paymentData}
          token={token}
        />
      )}
    </>
  );
} 