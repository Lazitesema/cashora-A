import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or service role key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const populateInitialData = async () => {
  // Populate banks
  const banks = [
    { name: "Commercial Bank of Ethiopia", code: "CBE" },
    { name: "Awash Bank", code: "AWB" },
    { name: "Dashen Bank", code: "DSB" },
    { name: "Bank of Abyssinia", code: "BOA" },
  ]

  const { data: banksData, error: banksError } = await supabase.from("banks").upsert(banks, { onConflict: "code" })

  if (banksError) {
    console.error("Error inserting banks:", banksError)
  } else {
    console.log("Banks inserted successfully")
  }

  // Create a test user
  const testUser = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "+251911234567",
    date_of_birth: "1990-01-01",
    address: "Addis Ababa, Ethiopia",
    balance: 1000.0,
  }

  const { data: userData, error: userError } = await supabase.from("users").upsert(testUser, { onConflict: "email" })

  if (userError) {
    console.error("Error inserting test user:", userError)
  } else {
    console.log("Test user inserted successfully")

    // Add some sample transactions for the test user
    const transactions = [
      {
        user_id: userData[0].id,
        type: "deposit",
        amount: 500.0,
        fee: 0,
        status: "completed",
      },
      {
        user_id: userData[0].id,
        type: "withdrawal",
        amount: -200.0,
        fee: 4.0,
        status: "completed",
      },
      {
        user_id: userData[0].id,
        type: "send",
        amount: -100.0,
        fee: 2.0,
        status: "completed",
        recipient: "jane.doe@example.com",
      },
    ]

    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .insert(transactions)

    if (transactionsError) {
      console.error("Error inserting sample transactions:", transactionsError)
    } else {
      console.log("Sample transactions inserted successfully")
    }

    // Add a sample user bank account
    const userBank = {
      user_id: userData[0].id,
      bank_id: banksData[0].id,
      account_number: "1234567890",
    }

    const { data: userBankData, error: userBankError } = await supabase.from("user_banks").insert(userBank)

    if (userBankError) {
      console.error("Error inserting user bank account:", userBankError)
    } else {
      console.log("User bank account inserted successfully")
    }

    // Add a sample notification
    const notification = {
      user_id: userData[0].id,
      message: "Welcome to Cashora! Your account has been created successfully.",
    }

    const { data: notificationData, error: notificationError } = await supabase
      .from("notifications")
      .insert(notification)

    if (notificationError) {
      console.error("Error inserting sample notification:", notificationError)
    } else {
      console.log("Sample notification inserted successfully")
    }
  }
}

populateInitialData()
  .then(() => console.log("Initial data population completed"))
  .catch((error) => console.error("Error populating initial data:", error))
  .finally(() => process.exit())

