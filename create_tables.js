import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cpbwqikuvtawzjqmwkaa.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwYndxaWt1dnRhd3pqcW13a2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTc5NzIsImV4cCI6MjA1Mjk3Mzk3Mn0.MhMIR4w6iy8crBXJ4jNS6ZgHIWS6GwIGrq-igXudZbE"

const supabase = createClient(supabaseUrl, supabaseKey)

const createTables = async () => {
  // Create users table
  const { data: usersData, error: usersError } = await supabase.from("users").select("*").limit(1)

  if (usersError && usersError.code === "42P01") {
    const { data, error } = await supabase.rpc("create_users_table")
    if (error) console.error("Error creating users table:", error)
    else console.log("Users table created successfully")
  } else {
    console.log("Users table already exists")
  }

  // Create transactions table
  const { data: transactionsData, error: transactionsError } = await supabase.from("transactions").select("*").limit(1)

  if (transactionsError && transactionsError.code === "42P01") {
    const { data, error } = await supabase.rpc("create_transactions_table")
    if (error) console.error("Error creating transactions table:", error)
    else console.log("Transactions table created successfully")
  } else {
    console.log("Transactions table already exists")
  }

  // Create banks table
  const { data: banksData, error: banksError } = await supabase.from("banks").select("*").limit(1)

  if (banksError && banksError.code === "42P01") {
    const { data, error } = await supabase.rpc("create_banks_table")
    if (error) console.error("Error creating banks table:", error)
    else console.log("Banks table created successfully")
  } else {
    console.log("Banks table already exists")
  }

  // Create user_banks table
  const { data: userBanksData, error: userBanksError } = await supabase.from("user_banks").select("*").limit(1)

  if (userBanksError && userBanksError.code === "42P01") {
    const { data, error } = await supabase.rpc("create_user_banks_table")
    if (error) console.error("Error creating user_banks table:", error)
    else console.log("User_banks table created successfully")
  } else {
    console.log("User_banks table already exists")
  }
}

createTables()

// Note: You need to create the following stored procedures in your Supabase database:
// create_users_table, create_transactions_table, create_banks_table, create_user_banks_table
// These procedures should contain the SQL to create the respective tables.

console.log("Table creation process completed")

