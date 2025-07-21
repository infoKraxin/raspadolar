import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Smartphone, CheckCircle, Copy, Timer } from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  updateUser: (data: any) => void;
}

const quickAmounts = [10, 25, 50, 100, 200, 500];

function PaymentModal({ isOpen, onClose, paymentData }: { isOpen: boolean; onClose: () => void; paymentData: any }) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    // Só reinicia o timer se o modal foi fechado e agora está aberto
    if (isOpen && !prevIsOpenRef.current) {
      setTimeLeft(900);
    }
    prevIsOpenRef.current = isOpen;
    if (isOpen) {
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
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pagamento PIX</h2>
            <button
              onClick={onClose}
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

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              Expira em: {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code PIX */}
          <div className="flex flex-col items-center mb-4">
            <QRCodeCanvas value={paymentData.payment.qrCode} size={180} bgColor="#18181b" fgColor="#facc15" includeMargin={true} />
            <span className="text-neutral-400 text-xs mt-2">Escaneie o QR Code com o app do seu banco</span>
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
                className="w-full h-24 p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-xs resize-none pointer-events-none select-none"
              />
              <Button
                onClick={copyPixCode}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Código PIX
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                1
              </div>
              <p className="text-neutral-300 text-sm">
                Abra o app do seu banco e escolha a opção PIX
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                2
              </div>
              <p className="text-neutral-300 text-sm">
                Selecione "Pix Copia e Cola" e cole o código acima
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                3
              </div>
              <p className="text-neutral-300 text-sm">
                Confirme o pagamento e aguarde a aprovação
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-medium">Aguardando pagamento</span>
            </div>
            <p className="text-neutral-300 text-xs">
              O saldo será creditado automaticamente após a confirmação do pagamento
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

  const handleQuickAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-700 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Fazer Depósito</h2>
              <button
                onClick={handleCloseAll}
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
      {/* Payment Modal */}
      {paymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleCloseAll}
          paymentData={paymentData}
        />
      )}
    </>
  );
} 