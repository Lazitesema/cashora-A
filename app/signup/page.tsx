"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createUser } from "@/lib/api"
import { supabase } from "@/lib/supabase"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    placeOfBirth: "",
    residence: "",
    nationality: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      toast({
        title: "Sign Up Failed",
        description: authError.message,
        variant: "destructive",
      })
      return
    }

    if (authData.user) {
      // Now create the user profile in our users table
      const { data, error } = await createUser({
        id: authData.user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        residence: formData.residence,
        nationality: formData.nationality,
      })

      if (error) {
        toast({
          title: "Profile Creation Failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. Please sign in.",
      })
      router.push("/signin")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Create a Cashora Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                type="text"
                required
                value={formData.placeOfBirth}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="residence">Residence</Label>
              <Input
                id="residence"
                name="residence"
                type="text"
                required
                value={formData.residence}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Select
                name="nationality"
                onValueChange={(value) => setFormData((prev) => ({ ...prev, nationality: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="et">Ethiopia</SelectItem>
                  <SelectItem value="ke">Kenya</SelectItem>
                  <SelectItem value="ng">Nigeria</SelectItem>
                  {/* Add more African countries as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

