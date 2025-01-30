import { NextResponse } from "next/server";
import { updateUser, handleError, getUser } from "@/lib/api";
import { sendEmail } from "@/lib/email";
import { User } from "@/lib/definitions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, reason } = body;

    if (!userId) {
      throw new Error("Missing userId");
    }

    const { data, error } = await getUser(userId);
    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Partial<User> = { approved: false }; // Ensure this field exists in User type
    const { data: updatedUser, error: updateUserError } = await updateUser(userId, updateData);
    if (updateUserError) throw updateUserError;

    await sendEmail({
      to: data.email,
      type: "account_rejection",
      data: { user: data, reason: reason || "No reason provided." },
    });

    return NextResponse.json({ message: "User rejected and email sent", updatedUser });
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
