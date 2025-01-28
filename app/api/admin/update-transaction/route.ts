import { NextResponse } from "next/server"
import { updateTransactionStatus, handleError, isAdmin } from "@/lib/api"

export async function PUT(req: Request) {
  try {
    const userId = req.headers.get("X-User-Id")
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { transactionId, status } = await req.json()
    const { data, error } = await updateTransactionStatus(transactionId, status)
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 })
  }
}

