import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const subscribeToUserChanges = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel("public:users")
    .on("postgres_changes", { event: "*", schema: "public", table: "users", filter: `id=eq.${userId}` }, callback)
    .subscribe()
}

export const subscribeToTransactions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel("public:transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${userId}` },
      callback,
    )
    .subscribe()
}

export async function createNotification(userId: string, message: string) {
  const { data, error } = await supabase.from("notifications").insert({ user_id: userId, message })

  if (error) {
    console.error("Error creating notification:", error)
    throw error
  }

  return data
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }

  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }

  return data
}

export async function getUserRole(userId: string) {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user role:", error)
    throw error
  }

  return data?.role
}

export async function checkPermission(userId: string, requiredRole: "admin" | "user") {
  const userRole = await getUserRole(userId)
  return userRole === requiredRole || (requiredRole === "user" && userRole === "admin")
}

