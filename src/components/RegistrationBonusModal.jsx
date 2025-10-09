import React from 'react';
import { X } from 'lucide-react';

/**
 * Modal exibido após o cadastro bem-sucedido para notificar o bônus de indicação.
 * @param {boolean} isOpen - Controla a visibilidade do modal.
 * @param {function} onClose - Função para fechar o modal.
 * @param {string} appGradient - Classe CSS para o gradiente principal (ex: 'bg-gradient-to-r from-yellow-500 to-amber-600').
 */
const RegistrationBonusModal = ({ isOpen, onClose, appGradient }) => {
    if (!isOpen) return null;

    // Classe de gradiente padrão para fallback
    const gradientClass = appGradient || 'bg-gradient-to-r from-yellow-500 to-amber-600';

    return (
        // Overlay (Fundo Escuro e Bloqueador de Interação)
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity duration-300">
            
            {/* Modal de Diálogo */}
            <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform scale-100 transition-transform duration-300 border border-neutral-700">
                
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Ícone de Destaque */}
                <div className="text-center mb-6">
                    <span className="text-6xl" role="img" aria-label="Bônus">
                        🥳
                    </span>
                </div>

                {/* Título e Mensagem */}
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3">
                    Bônus de Indicação!
                </h2>

                <p className="text-neutral-400 text-center mb-6 text-lg">
                    Seu cadastro foi concluído. Você foi **indicado por um amigo** e ganhou um bônus especial:
                </p>

                <div className="bg-green-700/30 p-4 rounded-lg border border-green-700 mb-6 text-center shadow-inner">
                    <p className="text-5xl font-extrabold text-green-400">
                        R$ 3.000
                    </p>
                    <p className="text-sm text-green-500 mt-1">
                        Saldo de Bônus (Indicação)
                    </p>
                </div>

                {/* Regra de Saque (Condição) */}
                <div className="p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                    <p className="font-bold mb-2 text-red-100">Condição para Saque:</p>
                    <p>
                        Para desbloquear o saque deste bônus, você deve ter um **depósito mínimo de R$ 70,00** ou um acumulativo de depósitos que atinja esse valor.
                    </p>
                </div>
                
                {/* Botão de Ação */}
                <button
                    onClick={onClose} // Fecha o modal e deve levar o usuário para a página de Depósito
                    className={`w-full py-3 mt-6 text-lg font-bold text-neutral-900 rounded-lg shadow-xl transition duration-200 transform active:scale-95 ${gradientClass}`}
                >
                    Depositar Agora e Desbloquear Bônus
                </button>
            </div>
        </div>
    );
};

export default RegistrationBonusModal;
