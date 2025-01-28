import { Resend } from "resend"

const resend = new Resend("re_VjP6dS7g_NWJ5Bg7vn2WNqXPAoA19DZ81")

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const data = await resend.emails.send({
      from: "Cashora <noreply@cashora.com>",
      to,
      subject,
      html,
    })

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

