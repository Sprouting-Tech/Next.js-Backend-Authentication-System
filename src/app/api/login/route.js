import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase"; // import users array

const SECRET = process.env.JWT_SECRET; // matches .env.local


export async function POST(req) {
  try {
    const { name, password } = await req.json();
    if (!name || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const {data:user} = await supabase
     .from("users")
      .select("*")
      .eq("name", name)
      .single();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id  },SECRET, {
      expiresIn: "1h",
    });
    const res = NextResponse.json(
      { message: "Login successful." },
      { status: 200 }
    );
    //Set HTTP-only cookie
   res.cookies.set("token", token, {
      httpOnly: true,
      secure:  process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
