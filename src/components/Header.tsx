"use client";

import {
  FaHome,
  FaWater,
  FaCalendarAlt,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="hidden md:flex w-full bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100 px-6 py-4 shadow-lg border-b border-sky-200 flex-col md:flex-row md:justify-between md:items-center relative z-50">
      <div className="flex justify-between items-center w-full">
        <Link
          href="/"
          className="text-2xl font-bold text-sky-800 tracking-tight"
        >
          🏄‍♂️ SurfNomad
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
        } md:flex flex-col md:flex-row mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-6 text-sky-800 text-lg font-medium`}
      >
        <Link
          href="/"
          className="hover:bg-sky-200 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaHome className="mr-2" />
          Home
        </Link>
        <Link
          href="/spots"
          className="hover:bg-sky-200 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaWater className="mr-2" />
          Spots
        </Link>
        <Link
          href="/events"
          className="hover:bg-sky-200 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaCalendarAlt className="mr-2" />
          Events
        </Link>
        <Link
          href="/community"
          className="hover:bg-sky-200 rounded-md px-3 py-1 transition flex items-center"
        >
          <FaUsers className="mr-2" />
          Community
        </Link>
        <div className="flex space-x-3 items-center md:ml-auto">
          <Link
            href="/login"
            className="px-4 py-1 text-base rounded-full border border-sky-500 text-sky-700 hover:bg-white hover:shadow transition"
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
