// src/app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { name, password, email, role, adminSecret } = await req.json();

    if (!name || !password || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password (optional, but recommended)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role
    let finalRole = "user";
    if (role === "admin" && adminSecret === process.env.ADMIN_SECRET) {
      finalRole = "admin";
    }

    // Insert user directly into "users" table (RLS disabled)
    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
