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
    <main className="max-w-5xl mx-auto px-4 py-8 bg-gradient-to-r from-sky-100 to-sky-50 rounded-xl">
      <div className="rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6 items-center">
        <Image
          src={profile.avatar_url || "/avatar-placeholder.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-white shadow-lg ring-2 ring-sky-300"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {profile.username}
          </h1>
          <p className="text-md text-sky-700 font-medium">{profile.home_region}</p>
          <p className="mt-2 text-slate-700">{profile.bio}</p>
          <div className="mt-3 flex gap-3 justify-center sm:justify-start">
            {profile.sns_links &&
              Object.entries(profile.sns_links).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform duration-200 shadow hover:shadow-md"
                >
                  {snsIconMap[key]}
                </a>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b-2 border-sky-200 pb-1">
          Your Posts
        </h2>
        {/* 投稿一覧表示（後で実装） */}
        <p className="text-slate-500 text-sm">Coming soon...</p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b-2 border-sky-200 pb-1">
          Joined Events
        </h2>
        {/* 参加イベント表示（後で実装） */}
        <p className="text-slate-500 text-sm">Coming soon...</p>
      </div>
    </main>
  );
}
