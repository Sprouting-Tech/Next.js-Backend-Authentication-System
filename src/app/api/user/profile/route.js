import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Access denied. Please log in." },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = jwt.verify(token, SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("id", payload.userId)
      .single();
      if (error || !user) {
  return NextResponse.json({ error: "User not found." }, { status: 404 });
}

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
