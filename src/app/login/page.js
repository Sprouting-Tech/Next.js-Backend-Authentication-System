"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", password: "" });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.password) {
      setMessage("All fields are required");
      return;
    }

    // Login API
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        password: form.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    // Profile API
    const profileRes = await fetch("/api/user/profile");
    if (!profileRes.ok) {
      const err = await profileRes.json();
      setMessage(err.error || "Failed to fetch profile");
      return;
    }

    const profileData = await profileRes.json();

    // Redirect based on role
    if (profileData.role === "admin") {
      router.push("/dashboard/admin");
    } else if (profileData.role === "user") {
      router.push("/dashboard/user");
    } else {
      setMessage("Invalid user role");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-pink-700 mb-6">
          Welcome
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 text-pink-700 font-semibold"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 text-pink-700 font-semibold"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition-colors font-semibold"
          >
            Log In
          </button>
        </form>
        {message && <p className="mt-4 text-center text-pink-600 font-semibold">{message}</p>}
        <p className="mt-4 text-center text-pink-700">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-500 font-semibold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
