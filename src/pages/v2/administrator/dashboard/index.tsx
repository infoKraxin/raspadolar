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
import { ArrowUpRight, ArrowDownLeft, Wallet, Users, Gift, Ticket } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["100", "200", "300","400","500", "600", "700"],
})

const statsCards = [
  {
    title: "Total de Entradas",
    value: "R$ 125.430,89",
    icon: ArrowUpRight,
    description: "Todo o período"
  },
  {
    title: "Total de Saídas",
    value: "R$ 89.234,50",
    icon: ArrowDownLeft,
    description: "Todo o período"
  },
  {
    title: "Total em Carteiras",
    value: "R$ 36.196,39",
    icon: Wallet,
    description: "Saldo atual"
  },
  {
    title: "Total feito por Indicações",
    value: "R$ 24.567,80",
    icon: Gift,
    description: "Todo o período"
  },
  {
    title: "Total de Usuários",
    value: "1.247",
    icon: Users,
    description: "Usuários cadastrados"
  },
  {
    title: "Total de Raspadinhas Abertas",
    value: "8.934",
    icon: Ticket,
    description: "Todo o período"
  }
];

export default function Page() {
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-neutral-800 border-neutral-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-neutral-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-neutral-500 text-xs">{stat.description}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                      <stat.icon className="w-6 h-6 text-neutral-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
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
