import { NextResponse } from "next/server";
import { createTransaction, handleError, getUser } from "@/lib/api";
import { sendEmail } from "@/lib/email";
import { PostgrestError } from "@supabase/supabase-js";
import { User } from "@/lib/definitions";

interface TransactionData {
  [key: string]: any; // Example: allows any fields
  type?: string;
  status?: string;
  user_id: string;
}

interface Transaction {
  id: string;
  amount: number;
  user: User;
}

interface CreateTransactionResponse {
  data?: Transaction[];
  error?: PostgrestError;
}

export async function POST(req: Request) {
  try {
    const transactionData: TransactionData = await req.json();

    // Basic validation for transactionData
    if (!transactionData || typeof transactionData !== 'object') {
        throw new Error('Invalid transaction data provided');
    }
    
    transactionData.type = "deposit"; // Set transaction type as deposit
    transactionData.status = "pending"; // Set initial status as pending

    const response = await createTransaction(transactionData);

    let transaction: Transaction | undefined = undefined;
    let error: any = undefined;

    if (response && response.data) {
        // we take the first element of the array
        const transactionData = response.data[0]
        if(transactionData){
          const {data: user, error} = await getUser(transactionData.user_id);
          if(user){
            transaction = {...transactionData, user} as Transaction;
          }
        }
    } else if (response && response.error) {
        error = response.error;
    }

    if (error) {
      throw error;
    }

    // Validate data and user before accessing properties
    if (transaction && transaction.user && transaction.user.email && typeof transaction.amount === 'number') {
        try {
            await sendEmail({
              to: transaction.user.email,
              type: "deposit_request",
              data: {
                name: transaction.user.name,
                amount: transaction.amount,
                transactionId: transaction.id,
              },
            });
        } catch (emailError) {
            // Handle email sending errors separately
            console.error("Error sending email:", emailError);
            // Decide if you want to fail the whole request or just log the error and continue
            // You might want to return a partial success or a custom error code here
            return NextResponse.json({message: "Deposit request created successfully, but there was an error sending the email", data: transaction}, { status: 207 });
        }
    } else {
        console.error("Invalid response structure or missing data:", transaction);
        throw new Error('Invalid data returned by createTransaction');
    }

    return NextResponse.json(
      { message: "Deposit request created successfully", data: transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /deposit:", error);
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
