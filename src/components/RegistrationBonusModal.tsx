import React from 'react';
import { X, Gift } from 'lucide-react';

interface RegistrationBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonusAmount: number; // Recebe o valor do bônus
}

export default function RegistrationBonusModal({ isOpen, onClose, bonusAmount }: RegistrationBonusModalProps) {
  if (!isOpen) return null;

  // Formatação para R$ 2.000,00
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(bonusAmount);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[51] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-sm w-full border-4 border-yellow-400 animate-in fade-in-0 zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 text-center relative">
            <div className="flex justify-center mb-4">
                <div className="p-4 bg-yellow-500 rounded-full shadow-xl shadow-yellow-500/50">
                    <Gift size={48} className="text-white animate-bounce" />
                </div>
            </div>

            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
                🎉 BÔNUS DE BOAS-VINDAS!
            </h2>
            
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                Parabéns, seu cadastro foi concluído com sucesso!
            </p>
            
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg mb-6">
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                    Você ganhou um bônus de:
                </p>
                <p className="text-5xl font-extrabold text-green-800 dark:text-green-100 mt-2">
                    {formattedAmount}
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-full bg-yellow-500 text-neutral-900 py-3 rounded-lg font-bold text-xl transition-all duration-200 shadow-md hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
            >
                Começar a Jogar Agora!
            </button>
            
            <p className="text-xs text-neutral-400 mt-4">
                *O bônus foi adicionado ao seu saldo. Aplicam-se Termos e Condições de Rollover.
            </p>
        </div>
      </div>
    </div>
  );
}
