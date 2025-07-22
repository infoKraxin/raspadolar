import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus, Ticket } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getAppColor } from "@/lib/colors"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Performance",
      url: "/v2/administrator/dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/v2/administrator/dashboard",
        },
      ],
    },
    {
      title: "Administrativo",
      url: "#",
      items: [
        {
          title: "Usuários",
          url: "/v2/administrator/users",
        },
        {
          title: "Depositos",
          url: "/v2/administrator/deposits",
        },
        {
          title: "Saques",
          url: "/v2/administrator/withdrawals",
        },
        {
          title: "Raspadinhas",
          url: "/v2/administrator/scratchs",
        },
      ],
    },
        {
      title: "Configurações",
      url: "#",
      items: [
        // {
        //   title: "Informações",
        //   url: "/v2/administrator/settings",
        // },
        {
          title: "Imagens",
          url: "/v2/administrator/settings/upload",
        },
        {
          title: "Credenciais API",
          url: "/v2/administrator/settings/credentials",
        },
        {
          title: "Licença",
          url: "/v2/administrator/ggr",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({})
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
    // Definir "Administrativo" como aberto por padrão após a hidratação
    setOpenItems({ "Administrativo": true })
  }, [])

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className={`${getAppColor()} text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg`}>
                  <Ticket className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                  <span className="text-sm">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                open={isClient ? (openItems[item.title] || false) : false}
                onOpenChange={() => toggleItem(item.title)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              // isActive={subItem.isActive}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
