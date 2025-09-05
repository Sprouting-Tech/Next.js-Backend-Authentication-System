"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserProfile() {
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
    <div className="flex flex-col items-center justify-center  min-h-screen bg-blue-50">
      <div className="relative w-32 h-32">
        <Image
          src={avatar || "/default-avatar.jpg"}
          alt="Profile Picture"
          width={128}
          height={128}
          className="rounded-full object-cover border-4 border-blue-300 shadow-md"
        />
        <label className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow hover:bg-blue-600 transition">
          +
          <input type="file" hidden onChange={handleFileChange} />
        </label>
      </div>
      <h2 className=" text-blue-500 font-semibold mt-16">{user.name}</h2>
      <p className="text-blue-500 mt-1">{user.email}</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Log Out
      </button>
    </div>
  );
}
