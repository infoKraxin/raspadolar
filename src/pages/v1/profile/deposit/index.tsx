import { useState } from 'react';
import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  QrCode
} from 'lucide-react';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

interface QuickAmountProps {
  amount: number;
  isSelected: boolean;
  onClick: () => void;
}

function QuickAmount({ amount, isSelected, onClick }: QuickAmountProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all duration-300 ${
        isSelected
          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
          : 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600 hover:border-neutral-500'
      }`}
    >
      <div className="text-center">
        <p className="text-lg font-semibold">R$ {amount}</p>
      </div>
    </button>
  );
}

export default function DepositPage() {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  
  const quickAmounts = [10, 25, 50, 100, 200, 500];
  
  const handleQuickAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };
  
  const handleCustomAmountChange = (value: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    setCustomAmount(cleanValue);
    setSelectedAmount(null);
  };
  
  const handleGeneratePayment = async () => {
    const amount = parseFloat(customAmount.replace(',', '.'));
    
    if (!amount || amount < 1) {
      alert('Por favor, insira um valor válido (mínimo R$ 1,00)');
      return;
    }
    
    setIsGeneratingPayment(true);
    
    // Simular geração de pagamento
    setTimeout(() => {
      setIsGeneratingPayment(false);
      // Aqui você redirecionaria para a página de pagamento ou mostraria o QR code
      alert(`Pagamento PIX gerado para R$ ${amount.toFixed(2).replace('.', ',')}`);
    }, 2000);
  };
  
  const getCurrentAmount = () => {
    return parseFloat(customAmount.replace(',', '.')) || 0;
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
            Fazer Depósito
          </h1>
          <p className="text-neutral-400">
            Adicione saldo à sua conta de forma rápida e segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Selection */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Valor do Depósito
              </h2>
              
              {/* Quick Amounts */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">
                  Valores Rápidos
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <QuickAmount
                      key={amount}
                      amount={amount}
                      isSelected={selectedAmount === amount}
                      onClick={() => handleQuickAmountSelect(amount)}
                    />
                  ))}
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
                    className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg font-semibold"
                  />
                </div>
                <p className="text-neutral-500 text-sm">
                  Valor mínimo: R$ 1,00
                </p>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                Método de Pagamento
              </h2>
              
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">PIX</h3>
                    <p className="text-blue-400 text-sm">Aprovação instantânea</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                </div>
                <p className="text-neutral-300 text-sm">
                  Pagamento processado automaticamente em até 2 minutos
                </p>
              </div>
            </div>
            
            {/* Generate Payment Button */}
            <Button
              onClick={handleGeneratePayment}
              disabled={!customAmount || getCurrentAmount() < 1 || isGeneratingPayment}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400/20 disabled:border-neutral-600/20 text-lg"
            >
              {isGeneratingPayment ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando Pagamento...
                </div>
              ) : (
                `Gerar Pagamento PIX - R$ ${getCurrentAmount().toFixed(2).replace('.', ',')}`
              )}
            </Button>
          </div>
          
          {/* Security Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Segurança
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium text-sm">Criptografia SSL</h4>
                    <p className="text-neutral-400 text-xs">Todas as transações são protegidas com criptografia de ponta</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium text-sm">Processamento Seguro</h4>
                    <p className="text-neutral-400 text-xs">Utilizamos os mais altos padrões de segurança bancária</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium text-sm">PIX Instantâneo</h4>
                    <p className="text-neutral-400 text-xs">Aprovação automática em até 2 minutos</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-amber-400 font-medium text-sm">Importante</h4>
                    <p className="text-amber-300 text-xs mt-1">
                      Mantenha seus dados de acesso seguros e nunca os compartilhe com terceiros.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-700">
                <h4 className="text-white font-medium text-sm mb-2">Suporte 24/7</h4>
                <p className="text-neutral-400 text-xs mb-3">
                  Precisa de ajuda? Nossa equipe está sempre disponível.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                >
                  Falar com Suporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}