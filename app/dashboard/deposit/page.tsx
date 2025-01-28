"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createTransaction, getUserTransactions } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface DepositTransaction {
  id: string
  amount: number
  status: "pending" | "accepted" | "rejected"
  created_at: string
  receipt_url?: string
}

export default function DepositPage() {
  const [fullName, setFullName] = useState("")
  const [amount, setAmount] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [transactions, setTransactions] = useState<DepositTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await getUserTransactions(user.id)
      if (error) {
        toast({
          title: "Error fetching transactions",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setTransactions(data.filter((t: any) => t.type === "deposit"))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      let receiptUrl = ""
      if (receipt) {
        const fileExt = receipt.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error } = await supabase.storage.from("receipts").upload(fileName, receipt)

        if (error) throw error

        const {
          data: { publicUrl },
        } = supabase.storage.from("receipts").getPublicUrl(fileName)

        receiptUrl = publicUrl
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          type: "deposit",
          amount: Number.parseFloat(amount),
          status: "pending",
          receipt_url: receiptUrl,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit deposit")

      toast({
        title: "Deposit Request Submitted",
        description: `Your deposit request for ETB ${amount} has been submitted and is pending approval.`,
      })

      setFullName("")
      setAmount("")
      setReceipt(null)
      fetchTransactions()
    } catch (error: any) {
      toast({
        title: "Error submitting deposit",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto p-8">
        <div>
          <h1 className="text-3xl font-bold mb-8">Deposit</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receipt">Receipt Upload</Label>
                  <Input id="receipt" type="file" onChange={(e) => setReceipt(e.target.files?.[0] || null)} required />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Deposit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>ETB {transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "accepted"
                              ? "success"
                              : transaction.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {transaction.receipt_url ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Receipt
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Deposit Receipt</DialogTitle>
                                <DialogDescription>
                                  Receipt for deposit on {new Date(transaction.created_at).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              <img
                                src={transaction.receipt_url || "/placeholder.svg"}
                                alt="Deposit Receipt"
                                className="max-w-full h-auto"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "No receipt"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

