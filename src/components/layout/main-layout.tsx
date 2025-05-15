
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Wallet, Calendar, PieChart, Settings } from "lucide-react";

type MainLayoutProps = {
  children: React.ReactNode;
  currentPage?: string;
};

export function MainLayout({ children, currentPage = "dashboard" }: MainLayoutProps) {
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Transactions", icon: Wallet, path: "/transactions" },
    { name: "Budget", icon: Calendar, path: "/budget" },
    { name: "Reports", icon: PieChart, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-3">
            <div className="flex items-center">
              <Wallet className="w-6 h-6 text-primary mr-2" />
              <span className="font-semibold text-lg">MoneyMinder</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild active={currentPage === item.name.toLowerCase()}>
                    <a
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        currentPage === item.name.toLowerCase()
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                MoneyMinder v1.0
              </div>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
