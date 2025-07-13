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
import { Search, Edit, Trash2, Users, UserPlus } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

// Mock data for users
const mockUsers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    nome: "João Silva Santos",
    cpf: "123.456.789-01",
    telefone: "(11) 99999-1234",
    saldoDisponivel: "R$ 1.250,00",
    totalDepositado: "R$ 5.000,00",
    totalSacado: "R$ 3.750,00",
    raspadinhasAbertas: 12,
    convidadoPor: "Maria Oliveira",
    status: "Ativo"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    nome: "Maria Oliveira Costa",
    cpf: "987.654.321-09",
    telefone: "(11) 98888-5678",
    saldoDisponivel: "R$ 850,50",
    totalDepositado: "R$ 3.200,00",
    totalSacado: "R$ 2.349,50",
    raspadinhasAbertas: 8,
    convidadoPor: "Pedro Santos",
    status: "Ativo"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    nome: "Pedro Santos Lima",
    cpf: "456.789.123-45",
    telefone: "(11) 97777-9012",
    saldoDisponivel: "R$ 0,00",
    totalDepositado: "R$ 1.500,00",
    totalSacado: "R$ 1.500,00",
    raspadinhasAbertas: 0,
    convidadoPor: "Direto",
    status: "Inativo"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    nome: "Ana Carolina Ferreira",
    cpf: "789.123.456-78",
    telefone: "(11) 96666-3456",
    saldoDisponivel: "R$ 2.100,75",
    totalDepositado: "R$ 8.500,00",
    totalSacado: "R$ 6.399,25",
    raspadinhasAbertas: 25,
    convidadoPor: "João Silva",
    status: "Ativo"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    nome: "Carlos Eduardo Souza",
    cpf: "321.654.987-12",
    telefone: "(11) 95555-7890",
    saldoDisponivel: "R$ 450,25",
    totalDepositado: "R$ 2.800,00",
    totalSacado: "R$ 2.349,75",
    raspadinhasAbertas: 5,
    convidadoPor: "Ana Carolina",
    status: "Ativo"
  }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm) ||
    user.telefone.includes(searchTerm) ||
    user.id.includes(searchTerm)
  );

  const handleEdit = (userId: string) => {
    console.log('Editar usuário:', userId);
    // Implementar lógica de edição
  };

  const handleDelete = (userId: string) => {
    console.log('Deletar usuário:', userId);
    // Implementar lógica de exclusão
    setUsers(users.filter(user => user.id !== userId));
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
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
                  <BreadcrumbPage className="text-white font-medium">Usuários</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Usuários</h1>
                  <p className="text-neutral-400 text-sm">Total de {users.length} usuários cadastrados</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            {/* Search Section */}
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Buscar por nome, CPF, telefone ou ID..."
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

            {/* Users Table */}
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-white">Lista de Usuários</h3>
                <p className="text-neutral-400 text-sm">Mostrando {filteredUsers.length} de {users.length} usuários</p>
              </div>
              
              <div className="overflow-x-auto p-6">
                <Table >
                  <TableHeader>
                    <TableRow className="border-neutral-700 hover:bg-neutral-700/50">
                      <TableHead className="text-neutral-300 font-medium">ID</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Nome</TableHead>
                      <TableHead className="text-neutral-300 font-medium">CPF</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Telefone</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Saldo</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Depositado</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Sacado</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Raspadinhas</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Convidado Por</TableHead>
                      <TableHead className="text-neutral-300 font-medium">Status</TableHead>
                      <TableHead className="text-neutral-300 font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-neutral-700 hover:bg-neutral-700/30">
                        <TableCell className="text-neutral-400 font-mono text-xs">
                          {user.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-white font-medium">{user.nome}</TableCell>
                        <TableCell className="text-neutral-300">{user.cpf}</TableCell>
                        <TableCell className="text-neutral-300">{user.telefone}</TableCell>
                        <TableCell className="text-white font-medium">{user.saldoDisponivel}</TableCell>
                        <TableCell className="text-green-400">{user.totalDepositado}</TableCell>
                        <TableCell className="text-red-400">{user.totalSacado}</TableCell>
                        <TableCell className="text-blue-400 font-medium">{user.raspadinhasAbertas}</TableCell>
                        <TableCell className="text-neutral-300">{user.convidadoPor}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user.id)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhum usuário encontrado</h3>
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