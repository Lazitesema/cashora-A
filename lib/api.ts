import { supabase } from "./supabase"

// User functions
export const createUser = async (userData: any) => {
  const { data, error } = await supabase.from("users").insert([userData]).select()
  if (!error) {
    await createAuditLog(data[0].id, "User Created", `User ${data[0].email} was created`)
  }
  return { data, error }
}

export const getUser = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
  return { data, error }
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select()
  if (!error) {
    await createAuditLog(userId, "User Updated", `User ${userId} was updated`)
  }
  return { data, error }
}

export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase.from("transactions").select("*").eq("user_id", userId)
  return { data, error }
}

// Transaction functions
export const createTransaction = async (transactionData: any) => {
  const { data, error } = await supabase.from("transactions").insert([transactionData]).select()
  if (!error) {
    await createAuditLog(transactionData.user_id, "Transaction Created", `Transaction ${data[0].id} was created`)
  }
  return { data, error }
}

// Admin functions
export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*")
  return { data, error }
}

export const getAllTransactions = async () => {
  const { data, error } = await supabase.from("transactions").select("*")
  return { data, error }
}

export const updateTransactionStatus = async (transactionId: string, status: string) => {
  const { data, error } = await supabase.from("transactions").update({ status }).eq("id", transactionId).select()
  if (!error) {
    await createAuditLog(
      data[0].user_id,
      "Transaction Updated",
      `Transaction ${transactionId} status updated to ${status}`,
    )
  }
  return { data, error }
}

export const updateUserStatus = async (userId: string, status: string) => {
  const { data, error } = await supabase.from("users").update({ status }).eq("id", userId).select()
  return { data, error }
}

export const getUserBanks = async (userId: string) => {
  const { data, error } = await supabase.from("user_banks").select("*, banks(*)").eq("user_id", userId)
  return { data, error }
}

export const addUserBank = async (userId: string, bankId: string, accountNumber: string) => {
  const { data, error } = await supabase
    .from("user_banks")
    .insert([{ user_id: userId, bank_id: bankId, account_number: accountNumber }])
    .select()
  return { data, error }
}

// Error handling function
export const handleError = (error: any) => {
  console.error("API Error:", error)
  return {
    error: {
      message: error.message || "An unexpected error occurred",
      status: error.status || 500,
    },
  }
}

// Helper function to check if user is admin
export const isAdmin = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()
  if (error) {
    console.error("Error checking admin status:", error)
    return false
  }
  return data?.role === "admin"
}

export const createAuditLog = async (userId: string, action: string, details: string) => {
  const { data, error } = await supabase.from("audit_logs").insert([{ user_id: userId, action, details }])

  if (error) {
    console.error("Error creating audit log:", error)
  }
  return { data, error }
}

