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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [residence, setResidence] = useState("");
  const [nationality, setNationality] = useState("");
  const [idCard, setIdCard] = useState<File | null>(null); // For ID card upload
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdCard(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError(null);

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase sign-up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Data to be sent to public.users
      const userData = {
        id: data.user?.id,
        email,
        first_name: firstName,
        last_name: lastName,
        username: username,
        date_of_birth: dateOfBirth,
        place_of_birth: placeOfBirth,
        residence: residence,
        nationality: nationality,
        role: "user", // Default role
        status: "pending",
      };
      console.log("userData to be sent:", userData);

      // Add user to the public.users table with 'pending' status
      const { error: userError } = await supabase.from("users").insert(userData);

      if (userError) {
        console.error("Error adding user to 'users' table:", userError);
        console.log("userError:", userError);
        toast({
          title: "Sign up failed",
          description:
            "Your account was created but there was an error processing your request.",
          variant: "destructive",
        });
      } else {
        if (idCard) {
          const { data: storageData, error: storageError } = await supabase.storage
            .from("id-cards")
            .upload(`${data.user?.id}/${idCard.name}`, idCard);

          if (storageError) {
            console.error("Error uploading ID card:", storageError);
            toast({
              title: "Upload failed",
              description:
                "There was an error uploading your ID card. Please try again later.",
              variant: "destructive",
            });
          }
          console.log("storageData", storageData);
        }

        toast({
          title: "Sign up successful",
          description:
            "Your account has been created. Please wait for admin approval.",
        });
        // Reset the form and navigate to home page
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setUsername("");
        setDateOfBirth("");
        setPlaceOfBirth("");
        setResidence("");
        setNationality("");
        setIdCard(null);
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                type="text"
                placeholder="New York"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residence">Residence</Label>
              <Input
                id="residence"
                type="text"
                placeholder="123 Main St, Anytown"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                type="text"
                placeholder="American"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idCard">ID Card Upload</Label>
              <Input
                id="idCard"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
