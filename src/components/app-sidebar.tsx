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
          url: "#",
        },
        {
          title: "Depositos",
          url: "#",
        },
        {
          title: "Saques",
          url: "#",
        },
        {
          title: "Raspadinhas",
          url: "#",
        },
        {
          title: "Jogadas",
          url: "#",
        },
      ],
    },
        {
      title: "Configurações",
      url: "#",
      items: [
        {
          title: "Credênciais de Pagamento",
          url: "#",
        },
        {
          title: "Taxas e limites",
          url: "#",
        },
        {
          title: "Configurações visuais",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Ticket className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">raspa.ae</span>
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
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
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
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              // isActive={item.isActive}
                            >
                              <a href={item.url}>{item.title}</a>
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
