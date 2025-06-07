"use client";

import { useEffect, useState } from "react";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import React from "react";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  home_region: string;
  sns_links: { [key: string]: string };
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }
        const data = await res.json();
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error("Error loading profile:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      }
    };
    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <p className="text-slate-500">Please try logging in again.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center py-10 text-slate-500">Loading profile...</p>
    );
  }

  const snsIconMap: { [key: string]: React.ReactNode } = {
    twitter: <FaTwitter className="text-blue-400" />,
    instagram: <FaInstagram className="text-pink-500" />,
    facebook: <FaFacebook className="text-blue-600" />,
  };

  return (
    <main className="relative max-w-5xl mx-auto px-4 py-20 bg-cover bg-center bg-[url('/profile-bg.jpg')]">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row gap-6 items-center backdrop-blur-sm">
        <div className="relative">
          <Image
            src={profile.avatar_url || "/avatar-placeholder.png"}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full border-[4px] border-white shadow-md ring-2 ring-sky-300 hover:scale-105 transition-transform duration-200"
          />
          {/* ステータスバッジ */}
          <span className="absolute bottom-1 right-1 bg-green-400 border-2 border-white w-4 h-4 rounded-full" />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight leading-snug">
            {profile.username}
          </h1>
          <p className="text-sm text-sky-500 font-medium uppercase tracking-wide">
            {profile.home_region}
          </p>
          <p className="mt-2 text-slate-600 italic">{profile.bio}</p>

          <div className="mt-4 flex gap-4 justify-center sm:justify-start">
            {profile.sns_links &&
              Object.entries(profile.sns_links).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-125 hover:rotate-1 transition-transform duration-300 text-slate-500 hover:text-sky-600"
                >
                  {snsIconMap[key]}
                </a>
              ))}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2 text-slate-800 border-l-4 border-sky-400 pl-3">
          Your Posts
        </h2>
        <div className="text-gray-500 text-sm bg-white bg-opacity-70 rounded-lg p-4 shadow-sm">Coming soon...</div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-slate-800 border-l-4 border-sky-400 pl-3">
          Joined Events
        </h2>
        <div className="text-gray-500 text-sm bg-white bg-opacity-70 rounded-lg p-4 shadow-sm">Coming soon...</div>
      </section>
    </main>
  );
}
