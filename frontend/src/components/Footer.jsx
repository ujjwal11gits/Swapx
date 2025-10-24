'use client';
import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-300 pt-10 pb-6 px-6 border-t border-red-600">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8
                text-center sm:text-left">
                {/* Brand */}
                <div className="flex flex-col items-center sm:items-start">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        <span>Swap</span><span className="text-red-600">X</span>
                    </h2>
                    <p className="text-sm text-gray-400">
                        SwapX is your community clothing exchange promoting sustainable fashion and reducing textile waste.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/" className="hover:text-red-500">Home</Link></li>
                        <li><Link href="/browse" className="hover:text-red-500">Browse Items</Link></li>
                        <li><Link href="/add-item" className="hover:text-red-500">List Item</Link></li>
                        <li><Link href="/dashboard" className="hover:text-red-500">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-lg font-semibold text-white mb-2">Company</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/about" className="hover:text-red-500">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
                        <li><Link href="/privacy" className="hover:text-red-500">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-red-500">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
                    <div className="flex space-x-4 mt-2 justify-center sm:justify-start">
                        <a href="#" className="hover:text-red-500"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-red-500"><FaFacebookF size={20} /></a>
                        <a href="#" className="hover:text-red-500"><FaXTwitter size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} SwapX. All rights reserved.
            </div>
        </footer>
    );
}
