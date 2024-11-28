import { Calendar, Home, Inbox } from 'lucide-react'
import { CustomSidebarTrigger } from "../ui/custom-trigger"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

const iconItems = [
  { title: "Sair", url: "/", icon: Home },
  { title: "Calendario", url: "#", icon: Calendar },
];

const navLinks = [
  { href: "#", text: "Home" },
  { href: "/chamada", text: "Chamada" },
  { href: "/lista-atletas", text: "Atletas" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center space-x-2">
            <CustomSidebarTrigger />
            <img
              src="https://lh3.googleusercontent.com/proxy/X-B99B9HsP3Lo4ae0nDQMozyMHTcxxdcPINH959IZlOUhqK7j0tdAK-sz09ISiS2c0ew2N4wyhXsHyR5EZ1vqwJKbh0VhZBj7gEfvT4DeFZkKw"
              alt="Logo"
              className="h-10"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {iconItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2 text-gray-700 hover:text-orange-500">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href={link.href} className="text-gray-700 hover:text-orange-500">
                      {link.text}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

