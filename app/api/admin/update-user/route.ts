import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, EmailType } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId, newStatus } = await req.json();

    if (!userId || !newStatus) {
      return NextResponse.json({ message: "User ID and new status are required" }, { status: 400 });
    }

    // Get the user's email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error getting user email:", userError);
      return NextResponse.json({ message: "Error getting user email" }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ status: newStatus })
      .eq("id", userId);

    if (updateError) {
      console.error("Supabase update user error:", updateError);
      return NextResponse.json({ message: "Error updating user status" }, { status: 500 });
    }

    // Send email to the user
    const email = userData.email;
    let emailType: EmailType;

    if (newStatus === "approved") {
      emailType = "account_approval";
    } else if (newStatus === "rejected") {
      emailType = "account_rejection";
    } else {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await sendEmail({
      to: email,
      type: emailType,
      data: {
        user: {
            email
        }
      }
    });

    return NextResponse.json({ message: "User status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
