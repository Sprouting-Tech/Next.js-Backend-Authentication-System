import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { name, password } = await req.json();
    if (!name || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // Check if user exists
    const {data: existingUser,  error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("name",name)
    .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .insert([{  name, password: hashedPassword }]);

    if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}

return NextResponse.json(
  { message: "User registered successfully" },
  { status: 201 }
);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
