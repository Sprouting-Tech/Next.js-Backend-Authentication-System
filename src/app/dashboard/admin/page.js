"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) {
        if (data.role !== "admin") {
          alert("Access denied");
          router.push("/login");
        } else {
          setUser(data);
        }
      } else {
        alert(data.error);
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const res = await fetch("/api/logout");
    const data = await res.json();
    if (res.ok) {
      alert("Logged out successfully!");
      router.push("/login");
    } else {
      alert(data.error || "Logout failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h2 className="text-2xl font-semibold text-red-700 mb-4">
        Admin Dashboard
      </h2>
      <p className="text-red-600 mb-6">Welcome, {user.name}!</p>

      <button
        onClick={() => router.push("/profile/admin")}
        className="mb-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
      >
        Go to Profile
      </button>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
}
