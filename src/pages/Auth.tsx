
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  async function handleSignUp() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Check your email for the confirmation link.",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="moneyminder-theme">
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto bg-primary rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">MoneyMinder</CardTitle>
            <CardDescription className="text-sm">Manage your finances with ease</CardDescription>
          </CardHeader>
          
          <div className="px-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 w-full h-10">
                <TabsTrigger value="signin" className="text-sm py-2">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm py-2">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardContent className="space-y-4 p-0">
                  {/* Google Sign In */}
                  <GoogleAuthButton />
                  
                  <div className="relative my-4">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <Input 
                      id="password"
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-4 px-0">
                  <Button 
                    className="w-full h-10 text-sm font-medium" 
                    onClick={handleSignIn}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardContent className="space-y-4 p-0">
                  {/* Google Sign In */}
                  <GoogleAuthButton />
                  
                  <div className="relative my-4">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm">Email</Label>
                    <Input 
                      id="signup-email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm">Password</Label>
                    <Input 
                      id="signup-password"
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-4 px-0">
                  <Button 
                    className="w-full h-10 text-sm font-medium" 
                    onClick={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </ThemeProvider>
  );
}
