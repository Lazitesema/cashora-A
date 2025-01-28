"use client"
import { TransactionsList } from "../components/transactions-list"
import { PageHeader } from "../components/page-header"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])

  const fetchTransactions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const response = await fetch("/api/transactions", {
          headers: { "X-User-Id": user.id },
        })
        if (!response.ok) throw new Error("Failed to fetch transactions")
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const response = await fetch("/api/admin/update-transaction", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.id,
          },
          body: JSON.stringify({ transactionId, status: newStatus }),
        })
        if (!response.ok) throw new Error("Failed to update transaction status")
        const updatedTransaction = await response.json()
        setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
        toast({
          title: "Transaction Updated",
          description: `Transaction status has been updated to ${newStatus}.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error updating transaction",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <motion.div className="space-y-6">
      <PageHeader title="Transactions" description="View and manage all transactions in the system" />
      <TransactionsList transactions={transactions} onUpdateStatus={handleUpdateTransactionStatus} />
    </motion.div>
  )
}

