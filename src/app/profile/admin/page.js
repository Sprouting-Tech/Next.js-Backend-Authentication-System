"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setAvatar(data.profile_image);
      } else {
        alert(data.error);
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/user/update-photo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setAvatar(data.profile_image); // ✅ updated key
    } else {
      alert(data.error);
    }
  }

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
    <div className="flex flex-col items-center p-6 min-h-screen bg-red-50">
      <div className="relative w-28 h-28">
        <Image
          src={avatar || "/default-avatar.jpg"}
          alt="Profile Picture"
          width={112}
          height={112}
          className="rounded-full object-cover border-2 border-red-300"
        />
        <label className="absolute bottom-0 right-0 bg-red-500 text-red rounded-full p-1 cursor-pointer">
          +
          <input type="file" hidden onChange={handleFileChange} />
        </label>
      </div>
      <h2 className="text-red-500 font-semibold mt-4">{user.name}</h2>
      <p className="text-red-500">{user.email}</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
}
