"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { PageHeader } from "../components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export default function EmailPage() {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("id, email, firstName, lastName")
    if (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setUsers(data || [])
    }
  }

  const handleRecipientChange = (userId: string) => {
    setSelectedRecipients((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: selectedRecipients,
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast({
        title: "Email Sent",
        description: `Your email has been sent successfully to ${selectedRecipients.length} recipient(s).`,
      })

      // Reset form
      setSelectedRecipients([])
      setSubject("")
      setMessage("")
    } catch (error: any) {
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <PageHeader title="Email Management" description="Send custom emails to users" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>Create and send professional emails to users</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <Label>Recipients</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-users"
                    checked={selectedRecipients.length === users.length}
                    onCheckedChange={(checked) => {
                      setSelectedRecipients(checked ? users.map((user) => user.id) : [])
                    }}
                  />
                  <Label htmlFor="all-users">All Users</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedRecipients.includes(user.id)}
                        onCheckedChange={() => handleRecipientChange(user.id)}
                      />
                      <Label htmlFor={`user-${user.id}`}>{`${user.firstName} ${user.lastName} (${user.email})`}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

