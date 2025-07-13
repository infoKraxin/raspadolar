import { useState } from 'react';
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Plus, Gift, DollarSign, Users, TrendingUp, Search } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
});

// Mock data das raspadinhas
const scratchCards = [
  {
    id: '1',
    name: 'Motorizado',
    image: '/scratchs/motorizado.webp',
    price: 5.00,
    maxPrize: 500.00,
    totalSold: 1250,
    totalAvailable: 2000,
    status: 'Ativo',
    description: 'Raspadinha com tema de entregador'
  },
  {
    id: '2',
    name: 'PIX na Conta',
    image: '/scratchs/pix_conta.webp',
    price: 10.00,
    maxPrize: 1000.00,
    totalSold: 850,
    totalAvailable: 1500,
    status: 'Ativo',
    description: 'Ganhe PIX direto na sua conta'
  },
  {
    id: '3',
    name: 'Shopee',
    image: '/scratchs/shopee.webp',
    price: 3.00,
    maxPrize: 300.00,
    totalSold: 2100,
    totalAvailable: 3000,
    status: 'Ativo',
    description: 'Raspadinha com tema Shopee'
  },
  {
    id: '4',
    name: 'Sonho',
    image: '/scratchs/sonho.webp',
    price: 15.00,
    maxPrize: 2000.00,
    totalSold: 450,
    totalAvailable: 1000,
    status: 'Inativo',
    description: 'Realize seus sonhos com esta raspadinha'
  }
];

// Stats data
const statsCards = [
  {
    title: "Total de Raspadinhas",
    value: "4",
    icon: Gift,
    description: "Raspadinhas cadastradas",
    color: "text-blue-400"
  },
  {
    title: "Raspadinhas Ativas",
    value: "3",
    icon: TrendingUp,
    description: "Disponíveis para venda",
    color: "text-green-400"
  },
  {
    title: "Total Vendidas",
    value: "4.650",
    icon: Users,
    description: "Raspadinhas vendidas",
    color: "text-purple-400"
  },
  {
    title: "Receita Total",
    value: "R$ 33.950,00",
    icon: DollarSign,
    description: "Receita gerada",
    color: "text-yellow-400"
  }
];

export default function ScratchCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const handleView = (id: string) => {
    console.log('Visualizar raspadinha:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Editar raspadinha:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir raspadinha:', id);
  };

  const handleCreate = () => {
    console.log('Criar nova raspadinha');
  };

  const filteredCards = scratchCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Inativo':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
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
                  <BreadcrumbPage className="text-white font-medium">Raspadinhas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Raspadinhas</h1>
                  <p className="text-neutral-400 text-sm">Total de {scratchCards.length} raspadinhas</p>
                </div>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Raspadinha
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-neutral-800 border-neutral-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-neutral-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className={`text-2xl font-bold mb-2 ${stat.color}`}>{stat.value}</p>
                      <p className="text-neutral-500 text-xs">{stat.description}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                      <stat.icon className="w-6 h-6 text-neutral-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Search Section */}
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Buscar por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </Card>

            {/* Scratch Cards Grid */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-white">Lista de Raspadinhas</h3>
                <p className="text-neutral-400 text-sm">Mostrando {filteredCards.length} de {scratchCards.length} raspadinhas</p>
              </div>
              
              <div className="p-6">
                {filteredCards.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhuma raspadinha encontrada</h3>
                    <p className="text-neutral-400 text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCards.map((card) => (
                      <div key={card.id} className="bg-neutral-700 rounded-lg border border-neutral-600 overflow-hidden hover:border-neutral-500 transition-colors">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{card.name}</h3>
                            <Badge className={getStatusColor(card.status)}>
                              {card.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-400 mb-3">{card.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Preço:</span>
                              <span className="text-white font-medium">R$ {card.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Prêmio Máximo:</span>
                              <span className="text-green-400 font-medium">R$ {card.maxPrize.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Vendidas:</span>
                              <span className="text-white">{card.totalSold}/{card.totalAvailable}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-neutral-400 mb-1">
                              <span>Progresso de vendas</span>
                              <span>{Math.round((card.totalSold / card.totalAvailable) * 100)}%</span>
                            </div>
                            <div className="w-full bg-neutral-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(card.totalSold / card.totalAvailable) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(card.id)}
                              className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(card.id)}
                              className="flex-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(card.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}