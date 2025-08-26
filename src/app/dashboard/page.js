"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        // Redirect to login page after 1 second
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage(data.error || "Failed to log out");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
      <h2 className="text-2xl font-semibold text-pink-700 mb-4">Dashboard</h2>
      <p className="text-pink-600 mb-6">Welcome! You are logged in.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
      >
        Log Out
      </button>
      {message && <p className="mt-4 text-pink-500 font-semibold">{message}</p>}
    </div>
  );
}
