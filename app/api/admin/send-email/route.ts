import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/api"

export async function POST(req: Request) {
  try {
    const { recipients, subject, message } = await req.json()

    // Verify admin status
    const adminId = req.headers.get("X-User-Id")
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { data: adminData } = await supabase.from("users").select("role").eq("id", adminId).single()
    if (!adminData || adminData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user emails
    const { data: users, error: userError } = await supabase.from("users").select("email").in("id", recipients)

    if (userError) {
      throw userError
    }

    // Send emails
    const emailPromises = users.map((user) =>
      sendEmail({
        to: user.email,
        subject,
        html: message,
      }),
    )

    await Promise.all(emailPromises)

    // Create audit log
    await createAuditLog(adminId, "Send Bulk Email", `Sent email to ${recipients.length} users`)

    return NextResponse.json({ success: true, message: "Emails sent successfully" })
  } catch (error: any) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

