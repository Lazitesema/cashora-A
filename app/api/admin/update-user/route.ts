import { NextResponse } from "next/server"
import { updateUserStatus, handleError, isAdmin } from "@/lib/api"
import { sendEmail } from "@/lib/email"

export async function PUT(req: Request) {
  try {
    const adminId = req.headers.get("X-User-Id")
    if (!adminId || !(await isAdmin(adminId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { userId, status } = await req.json()
    const { data, error } = await updateUserStatus(userId, status)
    if (error) throw error

    // Send email notification
    if (data) {
      const emailSubject =
        status === "approved" ? "Your Cashora Account Has Been Approved" : "Your Cashora Account Has Been Rejected"
      const emailContent =
        status === "approved"
          ? "<h1>Your Cashora Account Has Been Approved</h1><p>You can now log in and start using our services.</p>"
          : "<h1>Your Cashora Account Has Been Rejected</h1><p>Please contact our support team for more information.</p>"

      await sendEmail({
        to: data.email,
        subject: emailSubject,
        html: emailContent,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 })
  }
}

