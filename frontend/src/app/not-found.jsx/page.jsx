'use client';

import Link from 'next/link';
import { TbError404 } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <TbError404 size={100} className="text-red-600 mb-4" />

      <h1 className="text-5xl font-bold mb-2">
        Page Not <span className="text-red-600">Found</span>
      </h1>

      <p className="text-gray-400 text-lg mb-6 max-w-md">
        Oops! The page you're looking for doesn’t exist or has been moved.
      </p>

      <Link href="/">
        <span className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition">
          Back to Home
        </span>
      </Link>
    </main>
  );
}
