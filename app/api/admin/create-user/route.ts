import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
    });

    if (userError) {
      console.error("Supabase create user error:", userError);
      return NextResponse.json({ message: "Error creating user in auth.users" }, { status: 500 });
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: user.user?.id,
      email: email,
      first_name: "New",
      last_name: "User",
      role: "user",
      status: "pending",
    });

    if (insertError) {
      console.error("Supabase insert user error:", insertError);
      return NextResponse.json({ message: "Error inserting user into public.users" }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}