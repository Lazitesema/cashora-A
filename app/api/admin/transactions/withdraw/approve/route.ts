import { NextResponse } from "next/server";
import { updateTransactionStatus, handleError, isAdmin } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();
    const adminUserId = req.headers.get("X-User-Id");

    if (!adminUserId || !(await isAdmin(adminUserId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await updateTransactionStatus(transactionId, 'approved');
    if (error) throw error;

    return NextResponse.json({ message: "Withdrawal request approved", data });
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
