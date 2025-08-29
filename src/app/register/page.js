"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    password: "",
    email: "",
    role: "user",
    adminSecret: "",
    isAdmin: false,
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.password || !form.email) {
      setMessage("All fields are required");
      return;
    }

    if (form.isAdmin && !form.adminSecret) {
      setMessage("Admin secret is required");
      return;
    }

    // Send data to API
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        password: form.password,
        email: form.email, // no trimming needed
        role: form.isAdmin ? "admin" : "user",
        adminSecret: form.adminSecret,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
    } else {
      setMessage("User registered successfully! Redirecting...");
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-pink-700 mb-6">
          Create Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 text-pink-700 font-semibold"
          />

          {/* Admin Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isAdmin}
              onChange={(e) =>
                setForm({ ...form, isAdmin: e.target.checked, role: e.target.checked ? "admin" : "user" })
              }
            />
            <span className="text-pink-700 font-semibold">Register as Admin?</span>
          </label>

          {form.isAdmin && (
            <input
              type="password"
              placeholder="Admin Secret"
              value={form.adminSecret}
              onChange={(e) => setForm({ ...form, adminSecret: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 text-pink-700 font-semibold"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        <p className="mt-4 text-center text-pink-700">
          Already have an account?{" "}
          <a href="/login" className="text-pink-500 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
