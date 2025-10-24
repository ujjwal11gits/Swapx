"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({ isAdmin = false, user = null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

useEffect(() => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  setHasToken(!!token);
}, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Items", path: "/browse" },
    // { name: "List Item", path: "/add-item" },
    hasToken
      ? { name: "Dashboard", path: "/dashboard" }
      : { name: "Login", path: "/login" },
  ];

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50 border-b border-red-600 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">Swap</span>
            <span className="text-red-600">X</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-12 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-gray-300 hover:text-red-500 transition duration-150"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-red-500 font-semibold hover:underline"
              >
                Admin Panel
              </Link>
            )}
            {user && (
              <>
                <span className="text-sm text-gray-400">{user.email}</span>
                <button className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-red-600 px-4 pb-4 space-y-3 shadow">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="block text-gray-300 hover:text-red-500 transition"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="block text-red-500 font-semibold">
              Admin Panel
            </Link>
          )}
          {user && (
            <>
              <div className="text-sm text-gray-400">{user.email}</div>
              <button className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 mt-2 transition">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
