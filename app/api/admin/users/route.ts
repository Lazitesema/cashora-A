import { NextResponse } from "next/server";
import { createUser, handleError, isAdmin } from "@/lib/api";
import { sendEmail } from "@/lib/email";
import { User } from "@/lib/definitions";
import { PostgrestError } from "@supabase/supabase-js";

interface CreateUserResponse {
  data?: User[];
  error?: PostgrestError;
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("X-User-Id");
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { data, error } = await createUser(body);

    if (error) throw error;
    const user = data ? data[0] : undefined;
    if (user) {
      await sendEmail({
        to: user.email,
        type: "admin_created_account", // Correct: Using the string literal
        data: { user },
      });
    } else {
      console.error("Invalid response structure or missing data:", data);
      throw new Error("Invalid data returned by createUser");
    }

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /admin/users", error);
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
