import { useState } from 'react';
import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  History, 
  Bell,
  ChevronRight,
  Save,
  ArrowDownLeft
} from 'lucide-react';
import Image from 'next/image';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 rounded-lg group ${
        isActive 
          ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
      }`}
    >
      <div className={`transition-colors ${
        isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-white'
      }`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
        isActive ? 'text-blue-400' : 'text-neutral-600 group-hover:text-neutral-400'
      }`} />
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'joao@email.com',
    cpf: '538.873.688-19',
    phone: '61935001090'
  });

  const [withdrawData, setWithdrawData] = useState({
    pixKey: '',
    keyType: 'cpf',
    amount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Implementar lógica de salvamento
    console.log('Salvando alterações:', formData);
  };

  const sidebarItems = [
    { id: 'personal', icon: <User className="w-5 h-5" />, label: 'Informações Pessoais' },
    { id: 'withdraw', icon: <ArrowDownLeft className="w-5 h-5" />, label: 'Sacar Montante' },
    { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Segurança' },
    { id: 'financial', icon: <CreditCard className="w-5 h-5" />, label: 'Histórico Financeiro' },
    { id: 'games', icon: <History className="w-5 h-5" />, label: 'Histórico de Jogos' },
    { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Notificações' },
  ];

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-700">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/memojis/male-4.png"
                    alt="memoji"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">John Doe</h3>
                  <p className="text-neutral-400 text-sm">joao@email.com</p>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-8 p-4 bg-gradient-to-r from-neutral-500/10 to-neutral-600/10 rounded-lg border border-neutral-500/20">
                <p className="text-blue-400 text-sm font-medium mb-1">Seu saldo</p>
                <p className="text-white text-2xl font-bold">R$ 0,00</p>
                <Button 
                  className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400/20"
                  onClick={() => router.push('/v1/profile/deposit')}
                >
                  Depositar
                </Button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {activeSection === 'personal' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Informações Pessoais
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Gerencie suas informações pessoais e dados de contato
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white font-medium">
                        Nome completo
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-white font-medium">
                        CPF
                      </Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white font-medium">
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-700">
                    <Button 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar alterações
                    </Button>
                  </div>
                </div>
              )}

              {activeSection === 'withdraw' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Sacar Montante
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Realize saques para sua conta PIX de forma rápida e segura
                    </p>
                  </div>

                  {/* Saldo Atual */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium mb-1">Saldo disponível para saque</p>
                    <p className="text-white text-3xl font-bold">R$ 0,00</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label htmlFor="keyType" className="text-white font-medium">
                         Tipo de chave PIX
                       </Label>
                       <Select value={withdrawData.keyType} onValueChange={(value) => setWithdrawData(prev => ({ ...prev, keyType: value }))}>
                         <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-white focus:border-blue-500 focus:ring-blue-500/20">
                           <SelectValue placeholder="Selecione o tipo de chave" />
                         </SelectTrigger>
                         <SelectContent className="bg-neutral-700 border-neutral-600">
                           <SelectItem value="cpf" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">CPF</SelectItem>
                           <SelectItem value="email" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">E-mail</SelectItem>
                           <SelectItem value="phone" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">Telefone</SelectItem>
                           <SelectItem value="random" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">Chave aleatória</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white font-medium">
                        Valor do saque
                      </Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="R$ 0,00"
                        value={withdrawData.amount}
                        onChange={(e) => setWithdrawData(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="pixKey" className="text-white font-medium">
                        Chave PIX
                      </Label>
                      <Input
                        id="pixKey"
                        type="text"
                        placeholder="Digite sua chave PIX"
                        value={withdrawData.pixKey}
                        onChange={(e) => setWithdrawData(prev => ({ ...prev, pixKey: e.target.value }))}
                        className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-green-400/20"
                      >
                        <ArrowDownLeft className="w-4 h-4 mr-2" />
                        Sacar
                      </Button>
                      <div className="text-sm text-neutral-400">
                        <p>• Saques são processados em até 1 hora útil</p>
                        <p>• Valor mínimo: R$ 10,00</p>
                        <p>• Sem taxas para saques PIX</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Segurança
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Gerencie suas configurações de segurança e privacidade
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Alterar Senha</h3>
                      <p className="text-neutral-400 text-sm mb-4">Mantenha sua conta segura com uma senha forte</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Alterar Senha
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Autenticação de Dois Fatores</h3>
                      <p className="text-neutral-400 text-sm mb-4">Adicione uma camada extra de segurança à sua conta</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Configurar 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'financial' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Histórico Financeiro
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Visualize suas transações e movimentações financeiras
                    </p>
                  </div>
                  
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Nenhuma transação encontrada</p>
                  </div>
                </div>
              )}

              {activeSection === 'games' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Histórico de Jogos
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Acompanhe seu histórico de jogos e resultados
                    </p>
                  </div>
                  
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Nenhum jogo encontrado</p>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                      Notificações
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      Configure suas preferências de notificação
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Notificações por Email</h3>
                      <p className="text-neutral-400 text-sm mb-4">Receba atualizações importantes por email</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Configurar
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-neutral-700 rounded-lg border border-neutral-600">
                      <h3 className="text-white font-semibold mb-2">Notificações Push</h3>
                      <p className="text-neutral-400 text-sm mb-4">Receba notificações em tempo real no navegador</p>
                      <Button variant="outline" className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500">
                        Ativar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}