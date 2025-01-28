import { NextResponse } from "next/server"
import { createTransaction, getAllTransactions, handleError, isAdmin } from "@/lib/api"

export async function POST(req: Request) {
  try {
    const transactionData = await req.json()
    const { data, error } = await createTransaction(transactionData)
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("X-User-Id")
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { data, error } = await getAllTransactions()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 })
  }
}

