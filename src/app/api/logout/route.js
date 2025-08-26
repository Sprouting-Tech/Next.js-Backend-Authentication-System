import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { status: 200 }
    );

    // Clear the cookie
    response.cookies.set({
      name:"token",
      value:"",
      httpOnly: true,
      secure: false, // set to true in production
      sameSite: "strict",
      path: "/",
      maxAge: 0, // expires immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
