import { NextResponse } from "next/server"
import { createUser, getAllUsers, handleError, isAdmin } from "@/lib/api"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const userData = await req.json()
    const { data, error } = await createUser(userData)
    if (error) throw error

    // Send welcome email
    await sendEmail({
      to: userData.email,
      subject: "Welcome to Cashora",
      html: `
        <h1>Welcome to Cashora!</h1>
        <p>Your account has been created successfully. An admin will review your account shortly.</p>
      `,
    })

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
    const { data, error } = await getAllUsers()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 })
  }
}

