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

    if (data) {
      const updateData: Partial<User> = { approved: false }; // Fixed type issue
      const { data: updatedUser, error: updateUserError } = await updateUser(
        userId,
        updateData
      );
      if (updateUserError) throw updateUserError;

      if (updatedUser) {
        await sendEmail({
          to: data.email,
          type: "account_rejection", // Correct value
          data: { user: data, reason },
        });
      }
      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
