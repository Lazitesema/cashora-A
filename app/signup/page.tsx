"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase"; // Import supabase

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase sign-up error:", error);
      toast({
        title: "Sign up failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
    } else {
      // Add user to the public.users table with 'pending' status
      const { error: userError } = await supabase.from("users").insert({
        id: data.user?.id,
        email,
        first_name: "", // Placeholder, can be empty
        last_name: "", // Placeholder, can be empty
        role: "user", // Default role
        status: "pending",
      });

      if (userError) {
        console.error("Error adding user to 'users' table:", userError);
        toast({
          title: "Sign up failed",
          description:
            "Your account was created but there was an error processing your request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Your account has been created. Please wait for admin approval.",
        });
        // Reset the form and navigate to home page
        setEmail("");
        setPassword("");
        router.push("/");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Create your account
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
