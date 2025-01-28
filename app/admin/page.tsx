"use client"

import { useState, useEffect } from "react"
import { Heart, Users, ArrowUpDown, Send, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { MetricCard } from "./components/metric-card"
import { TransactionsChart } from "./components/transactions-chart"
import { RecentTransactions } from "./components/recent-transactions"
import { PageHeader } from "./components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

const banks = [
  {
    name: "Commercial Bank Of Ethiopia",
    users: "200 Users",
  },
  {
    name: "Awash Bank",
    users: "100 Users",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState(null)
  const [transactions, setTransactions] = useState(null)

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const [usersData, transactionsData] = await Promise.all([
          fetch("/api/users", {
            headers: { "X-User-Id": user.id },
          }).then((res) => res.json()),
          fetch("/api/transactions", {
            headers: { "X-User-Id": user.id },
          }).then((res) => res.json()),
        ])
        setUsers(usersData)
        setTransactions(transactionsData)
        // Process data for metrics and charts here
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin dashboard data. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin. Here's what's happening with your platform today."
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <MetricCard
                icon={Heart}
                title="Total Deposit"
                value="ETB 10,000,000"
                trend={8.2}
                trendIcon={TrendingUp}
                trendLabel="vs last month"
              />
            </div>
            <div>
              <MetricCard
                icon={ArrowUpDown}
                title="Total Withdrawals"
                value="ETB 5,000,000"
                trend={2.5}
                trendIcon={TrendingUp}
                trendLabel="vs last month"
              />
            </div>
            <div>
              <MetricCard
                icon={Send}
                title="Total Sendings"
                value="ETB 7,500,000"
                trend={5.7}
                trendIcon={TrendingUp}
                trendLabel="vs last month"
              />
            </div>
            <div>
              <MetricCard
                icon={DollarSign}
                title="Total Fee"
                value="ETB 500,000"
                trend={6.8}
                trendIcon={TrendingUp}
                trendLabel="vs last month"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <TransactionsChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3">
              <Card className="h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto">
                  <RecentTransactions transactions={transactions} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

