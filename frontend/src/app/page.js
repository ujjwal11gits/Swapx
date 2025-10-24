'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import Featured from "@/components/Featured";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODcyM2Y4O") {
      router.replace("/dashboard"); 
    }
  }, [router]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start">
          <div className="md:w-1/2 md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Revolutionize Fashion with <span className="text-red-600">SwapX</span>
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Exchange your unused clothes. Earn points. Save the planet.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/browse">
                <span className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition">
                  Start Swapping
                </span>
              </Link>
              {/* <Link href="/add-item">
                <span className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition">
                  List an Item
                </span>
              </Link> */}
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image
              src="/Heroimage.png"
              alt="SwapX Hero"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900 text-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-red-500 mb-2">1. Upload Clothes</h3>
            <p>Add your unused clothes with images and details. Let others discover them.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-500 mb-2">2. Earn Points or Swap</h3>
            <p>Get points for your items or directly swap with other users.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-500 mb-2">3. Make a Difference</h3>
            <p>Reduce waste, save money, and support sustainable fashion.</p>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="bg-black py-16 px-6 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <Featured />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-14 text-center">
        <h2 className="text-3xl font-semibold mb-4">Join the SwapX Movement</h2>
        <p className="mb-6">Thousands are already swapping and saving. What are you waiting for?</p>
        <Link href="/signup">
          <span className="bg-black hover:bg-gray-900 px-6 py-2 rounded text-white transition">
            Create an Account
          </span>
        </Link>
      </section>

      <Footer />
    </>
  );
}
