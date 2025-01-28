"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createTransaction, getUserTransactions, getUserBanks } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface WithdrawTransaction {
  id: string
  amount: number
  fee: number
  status: "pending" | "accepted" | "rejected"
  created_at: string
  bank_name: string
  account_number: string
}

interface Bank {
  id: string
  name: string
  account_number: string
}

const FEE_PERCENTAGE = 0.02 // 2% fee

export default function WithdrawPage() {
  const [amount, setAmount] = useState("")
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [transactions, setTransactions] = useState<WithdrawTransaction[]>([])
  const [userBanks, setUserBanks] = useState<Bank[]>([])
  const [accountHolderName, setAccountHolderName] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
    fetchUserBanks()
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
        setTransactions(data.filter((t: any) => t.type === "withdrawal"))
      }
    }
  }

  const fetchUserBanks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await getUserBanks(user.id)
      if (error) {
        toast({
          title: "Error fetching user banks",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setUserBanks(data)
      }
    }
  }

  const fee = Number.parseFloat(amount) * FEE_PERCENTAGE
  const totalAmount = Number.parseFloat(amount) - fee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmDialogOpen(true)
  }

  const confirmWithdrawal = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const selectedBankDetails = userBanks.find((bank) => bank.id === selectedBank)

      if (!selectedBankDetails) {
        throw new Error("Please select a bank")
      }

      const { data, error } = await createTransaction({
        user_id: user.id,
        type: "withdrawal",
        amount: -Number.parseFloat(amount), // negative amount for withdrawal
        fee: fee,
        status: "pending",
        bank_name: selectedBankDetails.name,
        account_number: selectedBankDetails.account_number,
        account_holder_name: accountHolderName,
      })

      if (error) throw error

      toast({
        title: "Withdrawal Request Submitted",
        description: `Your withdrawal request for ETB ${amount} has been submitted and is pending approval.`,
      })

      setAmount("")
      setSelectedBank("")
      setAccountHolderName("")
      fetchTransactions()
    } catch (error: any) {
      toast({
        title: "Error submitting withdrawal",
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
          <h1 className="text-3xl font-bold mb-8">Withdraw</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Make a Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    Total Amount to Receive: ETB {totalAmount.toFixed(2)}
                  </div>
                )}
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Full Name</Label>
                  <Input
                    id="accountHolderName"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {userBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Submit Withdrawal Request</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>ETB {Math.abs(transaction.amount).toFixed(2)}</TableCell>
                      <TableCell>ETB {transaction.fee.toFixed(2)}</TableCell>
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
                      <TableCell>{transaction.bank_name}</TableCell>
                      <TableCell>{transaction.account_number}</TableCell>
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
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>Please review the details of your withdrawal request.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>Amount:</strong> ETB {amount}
            </p>
            <p>
              <strong>Fee:</strong> ETB {fee.toFixed(2)}
            </p>
            <p>
              <strong>Total Amount to Receive:</strong> ETB {totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Account Holder Name:</strong> {accountHolderName}
            </p>
            <p>
              <strong>Bank:</strong> {userBanks.find((bank) => bank.id === selectedBank)?.name}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmWithdrawal} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

