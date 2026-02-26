import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Truck,
  LogOut,
  ChevronLeft,
  Box,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Inventory", url: "/inventory", icon: Warehouse },
  { title: "Point of Sale", url: "/pos", icon: ShoppingCart },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
          <Box className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-accent-foreground font-heading tracking-tight">
              NUKAH
            </span>
            <span className="text-[10px] text-sidebar-foreground uppercase tracking-widest">
              Inventory
            </span>
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest px-4 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold">
            AO
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                Admin User
              </p>
              <p className="text-[10px] text-sidebar-foreground truncate">
                admin@nukah.com
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-sidebar-foreground hover:text-destructive hover:bg-sidebar-accent shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
