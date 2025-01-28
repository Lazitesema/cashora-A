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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createTransaction, getUserTransactions } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface SendTransaction {
  id: string
  amount: number
  fee: number
  status: "pending" | "completed" | "rejected"
  created_at: string
  recipient: string
}

const FEE_PERCENTAGE = 0.02 // 2% fee

export default function SendMoneyPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState<SendTransaction[]>([])
  const [balance, setBalance] = useState(0)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
    fetchBalance()
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
        setTransactions(data.filter((t: any) => t.type === "send"))
      }
    }
  }

  const fetchBalance = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase.from("users").select("balance").eq("id", user.id).single()

      if (error) {
        toast({
          title: "Error fetching balance",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setBalance(data.balance)
      }
    }
  }

  const fee = Number.parseFloat(amount) * FEE_PERCENTAGE
  const totalAmount = Number.parseFloat(amount) + fee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmDialogOpen(true)
  }

  const confirmTransaction = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const sendAmount = Number.parseFloat(amount)
      if (sendAmount + fee > balance) {
        throw new Error("Insufficient balance for this transaction.")
      }

      const { data, error } = await createTransaction({
        user_id: user.id,
        type: "send",
        amount: -sendAmount, // negative amount for sending
        fee: fee,
        status: "pending",
        recipient: recipient,
      })

      if (error) throw error

      toast({
        title: "Money Transfer Initiated",
        description: `Your transfer of ETB ${amount} to ${recipient} has been initiated and is pending approval.`,
      })

      setRecipient("")
      setAmount("")
      fetchTransactions()
      fetchBalance()
    } catch (error: any) {
      toast({
        title: "Error sending money",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsConfirmDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto p-8">
        <div>
          <h1 className="text-3xl font-bold mb-8">Send Money</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient (Username or Email)</Label>
                  <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
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
                {amount && (
                  <div className="text-sm text-muted-foreground">
                    Fee: ETB {fee.toFixed(2)} (2%)
                    <br />
                    Total Amount: ETB {totalAmount.toFixed(2)}
                  </div>
                )}
                <Button type="submit">Send Money</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.recipient}</TableCell>
                      <TableCell>ETB {Math.abs(transaction.amount).toFixed(2)}</TableCell>
                      <TableCell>ETB {transaction.fee.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed"
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>Please review the details of your transaction.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>Recipient:</strong> {recipient}
            </p>
            <p>
              <strong>Amount:</strong> ETB {amount}
            </p>
            <p>
              <strong>Fee:</strong> ETB {fee.toFixed(2)}
            </p>
            <p>
              <strong>Total Amount:</strong> ETB {totalAmount.toFixed(2)}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmTransaction} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

