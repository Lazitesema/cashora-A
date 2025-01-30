import { NextResponse } from "next/server";
import { updateUser, handleError, getUser } from "@/lib/api";
import { sendEmail } from "@/lib/email";
import { User } from "@/lib/definitions";

interface ApproveUserBody {
  userId: string;
  status: "approved" | "rejected";
  reason?: string;
}

export async function POST(req: Request) {
  try {
    const body: ApproveUserBody = await req.json();
    const { userId, status } = body;

    if (!userId || !status) {
      throw new Error("Missing userId or status");
    }

    const { data, error } = await getUser(userId);
    if (error) throw error;

    if (data) {
      // ✅ Explicitly allow status in Partial<User>
      const updateData: Partial<User> & { status?: "approved" | "rejected" } = { 
        status 
      };

      const { data: updatedUser, error: updateUserError } = await updateUser(
        userId,
        updateData
      );
      if (updateUserError) throw updateUserError;

      if (updatedUser) {
        if (status === "approved") {
          await sendEmail({
            to: data.email,
            type: "account_approval",
            data: { user: data },
          });
        }
        if (status === "rejected") {
          await sendEmail({
            to: data.email,
            type: "account_rejection",
            data: { user: data, reason: body.reason },
          });
        }
      }
      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
