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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ArrowUpRight, Clock, CreditCard, DollarSign, Eye } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

// Mock data for deposits
const mockDeposits = [
  {
    id: "PAY_550e8400e29b41d4a716446655440001",
    status: "Pago",
    usuario: "João Silva Santos",
    valor: "R$ 250,00",
    dataCadastro: "2024-01-15 14:30:25",
    dataPagamento: "2024-01-15 14:32:10"
  },
  {
    id: "PAY_550e8400e29b41d4a716446655440002",
    status: "Pendente",
    usuario: "Maria Oliveira Costa",
    valor: "R$ 100,00",
    dataCadastro: "2024-01-15 16:45:12",
    dataPagamento: "-"
  },
  {
    id: "PAY_550e8400e29b41d4a716446655440003",
    status: "Pago",
    usuario: "Pedro Santos Lima",
    valor: "R$ 500,00",
    dataCadastro: "2024-01-14 09:15:33",
    dataPagamento: "2024-01-14 09:18:45"
  },
  {
    id: "PAY_550e8400e29b41d4a716446655440004",
    status: "Expirado",
    usuario: "Ana Carolina Ferreira",
    valor: "R$ 75,00",
    dataCadastro: "2024-01-13 20:22:18",
    dataPagamento: "-"
  },
  {
    id: "PAY_550e8400e29b41d4a716446655440005",
    status: "Pago",
    usuario: "Carlos Eduardo Souza",
    valor: "R$ 300,00",
    dataCadastro: "2024-01-15 11:05:44",
    dataPagamento: "2024-01-15 11:07:22"
  },
  {
    id: "PAY_550e8400e29b41d4a716446655440006",
    status: "Pendente",
    usuario: "Fernanda Lima Santos",
    valor: "R$ 150,00",
    dataCadastro: "2024-01-15 18:30:15",
    dataPagamento: "-"
  }
];

// Stats data
const statsCards = [
  {
    title: "Total aprovado",
    value: "R$ 1.050,00",
    icon: ArrowUpRight,
    description: "Depósitos confirmados",
    color: "text-green-400"
  },
  {
    title: "Total pendente",
    value: "R$ 250,00",
    icon: Clock,
    description: "Aguardando pagamento",
    color: "text-yellow-400"
  },
  {
    title: "Total de PIX Gerados",
    value: "6",
    icon: CreditCard,
    description: "Códigos PIX criados",
    color: "text-blue-400"
  }
];

export default function DepositsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deposits] = useState(mockDeposits);

  const filteredDeposits = deposits.filter(deposit => 
    deposit.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.valor.includes(searchTerm)
  );

  const handleView = (depositId: string) => {
    console.log('Visualizar depósito:', depositId);
    // Implementar lógica de visualização
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pendente':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Expirado':
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
                  <BreadcrumbPage className="text-white font-medium">Depósitos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Depósitos</h1>
                  <p className="text-neutral-400 text-sm">Total de {deposits.length} transações</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="Buscar por usuário, ID do pagamento, status ou valor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600">
                  Filtros
                </Button>
              </div>
            </Card>

            {/* Deposits Table */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-white">Lista de Depósitos</h3>
                <p className="text-neutral-400 text-sm">Mostrando {filteredDeposits.length} de {deposits.length} transações</p>
              </div>
              
              <div className="overflow-x-auto p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-700 hover:bg-neutral-700/50">
                      <TableHead className="text-neutral-300 font-medium">ID do Pagamento</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Status</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Usuário</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Valor</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Data de Cadastro</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Data de Pagamento</TableHead>
                      <TableHead className="text-neutral-300 font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeposits.map((deposit) => (
                      <TableRow key={deposit.id} className="border-neutral-700 hover:bg-neutral-700/30">
                        <TableCell className="text-neutral-400 font-mono text-xs">
                          {deposit.id.substring(0, 20)}...
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(deposit.status)}>
                            {deposit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-medium">{deposit.usuario}</TableCell>
                        <TableCell className="text-green-400 font-medium">{deposit.valor}</TableCell>
                        <TableCell className="text-neutral-300">{deposit.dataCadastro}</TableCell>
                        <TableCell className="text-neutral-300">
                          {deposit.dataPagamento === '-' ? (
                            <span className="text-neutral-500">-</span>
                          ) : (
                            deposit.dataPagamento
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(deposit.id)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredDeposits.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhum depósito encontrado</h3>
                  <p className="text-neutral-400 text-sm">Tente ajustar os filtros de busca</p>
                </div>
              )}
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}