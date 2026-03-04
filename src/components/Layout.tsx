import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, HelpCircle, Settings, LogOut, User, ChevronDown, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useFirestore";
import { markAllNotificationsRead } from "@/services/firestore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const notifIcon = {
  warning: <AlertTriangle className="h-3.5 w-3.5 text-warning" />,
  error: <XCircle className="h-3.5 w-3.5 text-destructive" />,
  success: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
  info: <Info className="h-3.5 w-3.5 text-info" />,
};

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { notifications: notifs } = useNotifications();
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch {
      // fallback for when firebase isn't configured
    }
    toast.success("All notifications marked as read");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top blue accent bar */}
          <div className="h-1 bg-primary shrink-0" />

          {/* Header */}
          <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-5" />
              <div>
                <h1 className="text-base font-bold font-heading text-foreground leading-tight">{title}</h1>
                {subtitle && (
                  <p className="text-[11px] text-muted-foreground leading-tight">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative hidden md:block mr-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 w-56 h-8 bg-secondary border-0 text-xs rounded" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </Button>

              {/* Notifications Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-destructive text-destructive-foreground border-2 border-card rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                    <h3 className="text-sm font-semibold font-heading">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={markAllRead}>Mark all read</Button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-auto">
                    {notifs.map((n) => (
                      <div key={n.id} className={cn(
                        "flex items-start gap-3 px-4 py-2.5 border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer",
                        !n.read && "bg-primary/3"
                      )}>
                        <div className="mt-0.5">{notifIcon[n.type]}</div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-medium", !n.read && "font-semibold")}>{n.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full h-7 text-[11px] text-primary">View All Notifications</Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Separator orientation="vertical" className="h-5 mx-1" />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 gap-2 px-2">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                      AO
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-medium leading-tight">Admin User</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">Administrator</p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs"><User className="h-3.5 w-3.5 mr-2" /> Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs"><Settings className="h-3.5 w-3.5 mr-2" /> Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-destructive"><LogOut className="h-3.5 w-3.5 mr-2" /> Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-5 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
