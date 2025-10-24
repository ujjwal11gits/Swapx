'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Featured() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('http://localhost:5000/api/items/featured');
        const data = await res.json();
        setFeaturedItems(data);
      } catch (err) {
        setFeaturedItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleViewDetails = (id) => {
    localStorage.setItem('selectedItemId', id);
    router.push('/itemdesc');
  };

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-red-600">
          Featured Items
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : featuredItems.length === 0 ? (
          <p className="text-center text-gray-400">No featured items available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <div
                key={item._id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-red-600 transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">Price: ${item.price}</p>
                  <button
                    onClick={() => handleViewDetails(item._id)}
                    className="inline-block mt-2 text-sm text-red-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
