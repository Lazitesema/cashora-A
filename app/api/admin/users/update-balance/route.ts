import { NextResponse } from "next/server";
import { updateUserBalance, handleError, isAdmin } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { userId, balance } = await req.json();
    const adminUserId = req.headers.get("X-User-Id");

    if (!adminUserId || !(await isAdmin(adminUserId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await updateUserBalance(userId, balance);
    if (error) throw error;

    return NextResponse.json({ message: "User balance updated successfully", data });
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
