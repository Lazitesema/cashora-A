"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase" // Import supabase

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase sign-in error:", error);
      toast({
        title: "Sign in failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } else {
      // Check user status and role from the database
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq('email', email)
        .single();

      if (userError) {
        console.error("Error getting user status and role:", userError);
        toast({
          title: "Sign in failed",
          description: "Error getting user status and role",
          variant: "destructive",
        });
        return;
      }

      if (user.status === "approved") {
        if (user.role === "admin") {
          localStorage.setItem("adminAuthenticated", "true");
          toast({
            title: "Sign in successful",
            description: "Welcome back, admin!",
          });
          router.push("/admin");
        } else {
          toast({
            title: "Sign in successful",
            description: "Welcome back!",
          });
          router.push("/");
        }
      } else {
        toast({
          title: "Account not approved",
          description: "Your account is not approved yet",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@cashora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Protected area.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
