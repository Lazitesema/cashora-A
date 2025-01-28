"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Users, ArrowUpDown, Send, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getUser, getUserTransactions } from "@/lib/api"
import { supabase, subscribeToUserChanges, subscribeToTransactions } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

const MetricCard = ({
  title,
  value,
  trend,
  icon: Icon,
  trendLabel,
}: {
  title: string
  value: string
  trend: number
  icon: any
  trendLabel: string
}) => {
  const isPositive = trend > 0

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div
          className={`rounded-full p-2 ${isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {isPositive ? (
          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(trend)}%</span>
        <span className="ml-1 text-muted-foreground">{trendLabel}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const [userData, transactionsData] = await Promise.all([
            fetch(`/api/users/${user.id}`).then((res) => res.json()),
            fetch(`/api/transactions?userId=${user.id}`).then((res) => res.json()),
          ])
          setUser(userData)
          setTransactions(transactionsData || [])
          const processedData = processTransactionsForChart(transactionsData || [])
          setChartData(processedData)

          // Subscribe to real-time updates
          const userSubscription = subscribeToUserChanges(user.id, (payload) => {
            setUser((prevUser: any) => ({ ...prevUser, ...payload.new }))
          })

          const transactionSubscription = subscribeToTransactions(user.id, (payload) => {
            if (payload.eventType === "INSERT") {
              setTransactions((prevTransactions) => [...prevTransactions, payload.new])
            } else if (payload.eventType === "UPDATE") {
              setTransactions((prevTransactions) =>
                prevTransactions.map((t) => (t.id === payload.new.id ? payload.new : t)),
              )
            } else if (payload.eventType === "DELETE") {
              setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== payload.old.id))
            }
            const updatedChartData = processTransactionsForChart(transactions)
            setChartData(updatedChartData)
          })

          return () => {
            userSubscription.unsubscribe()
            transactionSubscription.unsubscribe()
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [transactions]) // Added transactions to the dependency array

  const processTransactionsForChart = (transactions: any[]) => {
    // This is a simple example. You might want to aggregate by day or week depending on your needs.
    return transactions.slice(0, 7).map((t) => ({
      name: new Date(t.created_at).toLocaleDateString(),
      value: t.amount,
    }))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Deposit"
          value={`ETB ${user.total_deposits || 0}`}
          trend={8.2}
          icon={Heart}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Total Withdrawals"
          value={`ETB ${user.total_withdrawals || 0}`}
          trend={2.5}
          icon={ArrowUpDown}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Total Sendings"
          value={`ETB ${user.total_sendings || 0}`}
          trend={5.7}
          icon={Send}
          trendLabel="vs last month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 rounded-xl bg-card p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Transactions Overview</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-3 rounded-xl bg-card p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {transactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${transaction.id}`} />
                      <AvatarFallback>{transaction.type[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {transaction.amount > 0 ? "+" : "-"}ETB {Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

