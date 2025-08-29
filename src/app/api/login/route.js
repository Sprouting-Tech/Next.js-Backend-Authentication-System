import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Find user by username
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Create JWT token using `name` instead of auth_id
    const token = jwt.sign(
  { sub: user.id, name: user.name, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

    // Set cookie
    const response = NextResponse.json({ message: "Login successful", user: { name: user.name, role: user.role, email: user.email } });
    response.cookies.set("token", token, { httpOnly: true, path: "/" });

    return response;

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
