
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const [currency, setCurrency] = useState("VND");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("currency")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data && data.currency) {
          setCurrency(data.currency);
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };

    loadUserSettings();
  }, [user]);

  const handleUpdateCurrency = async (newCurrency: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ currency: newCurrency })
        .eq("id", user.id);

      if (error) throw error;
      
      setCurrency(newCurrency);
      toast({
        title: "Currency updated",
        description: `Your currency has been updated to ${newCurrency}`,
      });
    } catch (error) {
      console.error("Error updating currency:", error);
      toast({
        title: "Error updating currency",
        description: "There was a problem updating your currency.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const currencies = [
    { label: "Vietnamese Dong (₫)", value: "VND" },
    { label: "US Dollar ($)", value: "USD" },
    { label: "Euro (€)", value: "EUR" },
    { label: "Japanese Yen (¥)", value: "JPY" },
    { label: "British Pound (£)", value: "GBP" },
    { label: "Chinese Yuan (¥)", value: "CNY" },
  ];

  return (
    <MainLayout currentPage="settings" userActions={
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    }>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>
                Change the currency used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Select 
                    value={currency} 
                    onValueChange={handleUpdateCurrency}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
