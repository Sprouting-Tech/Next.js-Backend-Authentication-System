import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Query user by `name` instead of auth_id
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, profile_image")
      .eq("id", decoded.sub)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
