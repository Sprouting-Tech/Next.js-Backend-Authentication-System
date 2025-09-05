import jwt from "jsonwebtoken";
import cookie from "cookie";

export function authenticate(req) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return { error: "Access denied. Please log in." };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch {
    return { error: "Invalid or expired token." };
  }
}
