import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Coins, CreditCard, DollarSign, Percent, BadgeCheck, AlertTriangle, PlusCircle, Clock } from "lucide-react";
import { Poppins } from 'next/font/google';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

interface LicenseData {
  id: string;
  credits: number;
  credits_used: number;
  credits_value: string;
  ggr_percentage: string;
  total_earnings: string;
  is_active: boolean;
}

interface LicenseUsage {
  id: string;
  userId: string;
  licenseId: string;
  scratchCardId: string;
  credits_used: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    email: string;
  };
  license: {
    id: string;
    credits: number;
    credits_used: number;
    credits_value: string;
    ggr_percentage: string;
  };
  scratchCard: {
    id: string;
    name: string;
    price: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function GGRPage() {
  const { token } = useAuth();
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [usageData, setUsageData] = useState<LicenseUsage[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(true);
  const [error, setError] = useState('');
  const [usageError, setUsageError] = useState('');
  
  // Estados para os modais
  const [creditsAmount, setCreditsAmount] = useState('');
  const [earningsAmount, setEarningsAmount] = useState('');
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const [isAddingEarnings, setIsAddingEarnings] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchLicenseData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('https://api.raspapixoficial.com/v1/api/license/current', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar dados da licença');
        }

        setLicenseData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsageData = async () => {
      if (!token) return;
      
      try {
        setUsageLoading(true);
        const response = await fetch('https://api.raspapixoficial.com/v1/api/license/usage', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar dados de uso da licença');
        }

        setUsageData(data.data);
        setPagination(data.pagination);
      } catch (err: any) {
        setUsageError(err.message);
      } finally {
        setUsageLoading(false);
      }
    };

    fetchLicenseData();
    fetchUsageData();
  }, [token]);
  
  // Função para adicionar créditos
  const handleAddCredits = async () => {
    if (!token || !creditsAmount) return;
    
    try {
      setIsAddingCredits(true);
      setModalError('');
      setModalSuccess('');
      
      const response = await fetch('https://api.raspapixoficial.com/v1/api/license/credits', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: parseInt(creditsAmount)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar créditos');
      }

      // Atualizar os dados da licença
      const licenseResponse = await fetch('https://api.raspapixoficial.com/v1/api/license/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const licenseData = await licenseResponse.json();
      
      if (licenseResponse.ok) {
        setLicenseData(licenseData.data);
      }
      
      setModalSuccess('Créditos adicionados com sucesso!');
      setCreditsAmount('');
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsAddingCredits(false);
    }
  };
  
  // Função para adicionar arrecadação
  const handleAddEarnings = async () => {
    if (!token || !earningsAmount) return;
    
    try {
      setIsAddingEarnings(true);
      setModalError('');
      setModalSuccess('');
      
      const response = await fetch('https://api.raspapixoficial.com/v1/api/license/earnings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(earningsAmount)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar arrecadação');
      }

      // Atualizar os dados da licença
      const licenseResponse = await fetch('https://api.raspapixoficial.com/v1/api/license/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const licenseData = await licenseResponse.json();
      
      if (licenseResponse.ok) {
        setLicenseData(licenseData.data);
      }
      
      setModalSuccess('Arrecadação adicionada com sucesso!');
      setEarningsAmount('');
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsAddingEarnings(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const getGGRCards = () => {
    if (!licenseData) return [];
    
    return [
      {
        title: "Créditos Disponíveis",
        value: licenseData.credits.toString(),
        icon: Coins,
        description: "Total de créditos",
        color: "text-green-400"
      },
      {
        title: "Créditos Utilizados",
        value: licenseData.credits_used.toString(),
        icon: CreditCard,
        description: "Créditos consumidos",
        color: "text-yellow-400"
      },
      {
        title: "Valor do Crédito",
        value: formatCurrency(licenseData.credits_value),
        icon: DollarSign,
        description: "Valor unitário",
        color: "text-yellow-400"
      },
      {
        title: "Porcentagem GGR",
        value: `${licenseData.ggr_percentage}%`,
        icon: Percent,
        description: "Taxa aplicada",
        color: "text-purple-400"
      },
      {
        title: "Total Arrecadado GGR",
        value: formatCurrency(licenseData.total_earnings),
        icon: DollarSign,
        description: "Valor total",
        color: "text-cyan-400"
      },
      {
        title: "Status da Licença",
        value: licenseData.is_active ? "Ativa" : "Inativa",
        icon: licenseData.is_active ? BadgeCheck : AlertTriangle,
        description: licenseData.is_active ? "Licença válida" : "Licença expirada",
        color: licenseData.is_active ? "text-green-400" : "text-red-400"
      }
    ];
  };

  return (
    <div className={poppins.className}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-neutral-600"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">GGR</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            {!loading && !error && licenseData && (
              <div className="flex flex-wrap gap-4 mb-6">
                {/* Adicionar Créditos */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700">
                      <PlusCircle className="w-4 h-4 text-green-400" />
                      Adicionar Créditos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Adicionar Créditos</DialogTitle>
                      <DialogDescription className="text-neutral-400">
                        Adicione créditos à sua licença atual.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {modalSuccess && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                        <p className="text-green-400 text-sm">{modalSuccess}</p>
                      </div>
                    )}
                    
                    {modalError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <p className="text-red-400 text-sm">{modalError}</p>
                      </div>
                    )}
                    
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <label htmlFor="credits" className="text-sm font-medium text-white">
                          Quantidade de Créditos
                        </label>
                        <Input
                          id="credits"
                          type="number"
                          placeholder="Ex: 1000"
                          value={creditsAmount}
                          onChange={(e) => setCreditsAmount(e.target.value)}
                          className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        onClick={handleAddCredits} 
                        disabled={isAddingCredits || !creditsAmount}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isAddingCredits ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          'Adicionar Créditos'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Adicionar Arrecadação */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700">
                      <PlusCircle className="w-4 h-4 text-cyan-400" />
                      Adicionar Arrecadação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Adicionar Arrecadação</DialogTitle>
                      <DialogDescription className="text-neutral-400">
                        Adicione valores arrecadados ao GGR.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {modalSuccess && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                        <p className="text-green-400 text-sm">{modalSuccess}</p>
                      </div>
                    )}
                    
                    {modalError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <p className="text-red-400 text-sm">{modalError}</p>
                      </div>
                    )}
                    
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <label htmlFor="earnings" className="text-sm font-medium text-white">
                          Valor Arrecadado (R$)
                        </label>
                        <Input
                          id="earnings"
                          type="number"
                          step="0.01"
                          placeholder="Ex: 500.00"
                          value={earningsAmount}
                          onChange={(e) => setEarningsAmount(e.target.value)}
                          className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        onClick={handleAddEarnings} 
                        disabled={isAddingEarnings || !earningsAmount}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        {isAddingEarnings ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          'Adicionar Arrecadação'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            {/* GGR Cards */}
            {!loading && !error && licenseData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getGGRCards().map((card, index) => (
                  <Card key={index} className="bg-neutral-800 border-neutral-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-400 text-sm font-medium mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                        <p className="text-neutral-500 text-xs">{card.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                        <card.icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Usage List */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Histórico de Uso de Licença</h3>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Últimas atividades</span>
                </div>
              </div>
              
              {/* Loading State */}
              {usageLoading && (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {/* Error State */}
              {usageError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{usageError}</p>
                </div>
              )}
              
              {/* Usage Table */}
              {!usageLoading && !usageError && usageData.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-700 hover:bg-neutral-800">
                      <TableHead className="text-neutral-400">Data</TableHead>
                      <TableHead className="text-neutral-400">Usuário</TableHead>
                      <TableHead className="text-neutral-400">Raspadinha</TableHead>
                      <TableHead className="text-neutral-400">Preço</TableHead>
                      <TableHead className="text-neutral-400 text-right">Créditos Usados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageData.map((usage) => (
                      <TableRow key={usage.id} className="border-neutral-700 hover:bg-neutral-700/50">
                        <TableCell className="text-white">
                          {format(new Date(usage.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-white">
                          {usage.user.full_name || usage.user.username}
                        </TableCell>
                        <TableCell className="text-white">
                          {usage.scratchCard.name}
                        </TableCell>
                        <TableCell className="text-white">
                          {formatCurrency(usage.scratchCard.price)}
                        </TableCell>
                        <TableCell className="text-white text-right font-medium">
                          {usage.credits_used}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption className="text-neutral-500 mt-4">
                    Mostrando {usageData.length} de {pagination.total} registros
                  </TableCaption>
                </Table>
              )}
              
              {/* Empty State */}
              {!usageLoading && !usageError && usageData.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-neutral-400">Nenhum registro de uso encontrado</p>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}