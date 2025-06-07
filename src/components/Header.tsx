"use client";

import {
  FaHome,
  FaWater,
  FaCalendarAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="hidden md:flex w-full bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#00B4D8] px-6 py-2 shadow-lg border-b border-sky-200 flex-col md:flex-row md:justify-between md:items-center relative z-50">
      <div className="flex justify-between items-center w-full">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/headericon.png" // ← public配下に配置
            alt="SurfNomad Logo"
            width={100}
            height={40}
            className="object-contain"
          />
        </Link>
        <button
          className="md:hidden text-sky-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      <nav
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-6 text-white text-lg font-medium`}
      >
        <Link
          href="/"
          className="hover:bg-white/20 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaHome className="mr-2" />
          Home
        </Link>
        <Link
          href="/spots"
          className="hover:bg-white/20 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaWater className="mr-2" />
          Spots
        </Link>
        <Link
          href="/events"
          className="hover:bg-white/20 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaCalendarAlt className="mr-2" />
          Events
        </Link>
        <Link
          href="/profile"
          className="hover:bg-white/20 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaUser className="mr-2" />
          Profile
        </Link>
        <div className="flex space-x-3 items-center md:ml-auto">
          <Link
            href="/login"
            className="px-4 py-1 text-base rounded-full border border-white/60 text-white hover:bg-white/20 hover:shadow transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-base bg-sky-600 text-white px-4 py-1 rounded-full shadow-md hover:bg-sky-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
