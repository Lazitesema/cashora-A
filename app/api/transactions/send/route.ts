import { NextResponse } from "next/server";
import { createTransaction, handleError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const transactionData = await req.json();
    transactionData.type = "send"; // Set transaction type as send
    transactionData.status = "pending"; // Set initial status as pending
    const { data, error } = await createTransaction(transactionData);
    if (error) throw error;

    return NextResponse.json({ message: "Send request created successfully", data }); // Respond with the data
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
