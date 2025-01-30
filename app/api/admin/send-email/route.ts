import { NextResponse } from "next/server";
import { rejectUser, handleError, isAdmin } from "@/lib/api";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { userId, reason } = await req.json();
    const adminUserId = req.headers.get("X-User-Id");

    if (!adminUserId || !(await isAdmin(adminUserId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await rejectUser(userId);
    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // Send email notification
    await sendEmail({
      type: "account_rejection", // Correct value
      to: data.email,
      data: {
        username: data.name,
        reason: reason || "No reason provided.",
      },
    });

    return NextResponse.json({ message: "User rejected and email sent", data });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
