'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('http://localhost:5000/api/items/all');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleViewDetail = (itemId) => {
    localStorage.setItem('selectedItemId', itemId);
    router.push('/itemdesc');
  };

  return (
    <main className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-10">
          Browse Items
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400">No items available for swap.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow hover:shadow-red-600 transition-shadow"
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
                  <p className="text-sm text-gray-400">Price: {item.price}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <button
                    onClick={() => handleViewDetail(item._id)}
                    className="inline-block text-sm text-red-500 hover:underline mt-2 bg-transparent border-none cursor-pointer"
                  >
                    View Item →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
