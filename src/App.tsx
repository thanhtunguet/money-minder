
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { FinanceProvider } from "@/context/finance-context";
import { AuthProvider } from "@/context/auth-context";
import { RequireAuth } from "@/components/auth/require-auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="moneyminder-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth route is publicly accessible */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <RequireAuth>
                    <FinanceProvider>
                      <Index />
                    </FinanceProvider>
                  </RequireAuth>
                } 
              />

              <Route 
                path="/transactions" 
                element={
                  <RequireAuth>
                    <FinanceProvider>
                      <Transactions />
                    </FinanceProvider>
                  </RequireAuth>
                } 
              />

              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <FinanceProvider>
                      <Settings />
                    </FinanceProvider>
                  </RequireAuth>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
