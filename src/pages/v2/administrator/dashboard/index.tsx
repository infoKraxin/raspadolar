import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Wallet, Users, Gift, Ticket, TrendingUp, DollarSign } from "lucide-react"
import { Poppins } from 'next/font/google'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

interface StatsData {
  deposits: {
    total: { amount: string; count: number };
    pending: { amount: string; count: number };
    approved: { amount: string; count: number };
    rejected: { amount: string; count: number };
  };
  withdrawals: {
    total: { amount: string; count: number };
    pending: { amount: string; count: number };
    approved: { amount: string; count: number };
    rejected: { amount: string; count: number };
  };
  users: {
    total: number;
    today: number;
    totalBalance: string;
  };
  affiliates: {
    total: number;
    today: number;
    totalCommissions: number;
  };
  games: {
    totalBet: string;
    totalDistributed: string;
    totalGames: number;
    profit: number;
  };
  summary: {
    totalRevenue: string;
    totalCosts: string;
    netProfit: number;
    totalInWallets: string;
  };
}

export default function Page() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('https://api.raspapixoficial.com/v1/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar estatísticas');
        }

        setStats(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const getStatsCards = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Total de Depósitos",
        value: formatCurrency(stats.deposits.total.amount),
        icon: ArrowUpRight,
        description: `${stats.deposits.total.count} transações`,
        color: "text-green-400"
      },
      {
        title: "Total de Saques",
        value: formatCurrency(stats.withdrawals.total.amount),
        icon: ArrowDownLeft,
        description: `${stats.withdrawals.total.count} transações`,
        color: "text-red-400"
      },
      {
        title: "Total em Carteiras",
        value: formatCurrency(stats.users.totalBalance),
        icon: Wallet,
        description: "Saldo atual dos usuários",
        color: "text-blue-400"
      },
      {
        title: "Total de Usuários",
        value: stats.users.total.toString(),
        icon: Users,
        description: `${stats.users.today} novos hoje`,
        color: "text-purple-400"
      },
      {
        title: "Total Apostado",
        value: formatCurrency(stats.games.totalBet),
        icon: Ticket,
        description: `${stats.games.totalGames} jogos`,
        color: "text-yellow-400"
      },
      {
        title: "Lucro Líquido",
        value: formatCurrency(stats.summary.netProfit),
        icon: TrendingUp,
        description: "Lucro total",
        color: stats.summary.netProfit >= 0 ? "text-green-400" : "text-red-400"
      },
      {
        title: "Comissões de Afiliados",
        value: formatCurrency(stats.affiliates.totalCommissions),
        icon: Gift,
        description: `${stats.affiliates.total} afiliados`,
        color: "text-orange-400"
      },
      {
        title: "Total Distribuído",
        value: formatCurrency(stats.games.totalDistributed),
        icon: DollarSign,
        description: "Prêmios pagos",
        color: "text-cyan-400"
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
                  <BreadcrumbPage className="text-white font-medium">Dashboard</BreadcrumbPage>
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
            
            {/* Stats Cards */}
            {!loading && !error && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getStatsCards().map((stat, index) => (
                  <Card key={index} className="bg-neutral-800 border-neutral-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-400 text-sm font-medium mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                        <p className="text-neutral-500 text-xs">{stat.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Additional Content Area */}
            <div className="bg-neutral-800 border border-neutral-700 min-h-[60vh] flex-1 rounded-xl p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Dashboard em Desenvolvimento</h3>
                  <p className="text-neutral-400 text-sm">Mais funcionalidades serão adicionadas em breve</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
