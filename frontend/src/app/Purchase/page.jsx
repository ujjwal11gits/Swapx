'use client';

import { useState } from 'react';

export default function PurchaseCoins() {
  const [coins, setCoins] = useState(120); // Example current coin balance
  const [message, setMessage] = useState('');

  const coinPackages = [
    { id: 1, coins: 50, price: 49 },
    { id: 2, coins: 100, price: 89 },
    { id: 3, coins: 250, price: 199 },
    { id: 4, coins: 500, price: 349 },
  ];

  const handlePurchase = (pkg) => {
    // Placeholder logic - replace with real payment integration
    setCoins(coins + pkg.coins);
    setMessage(`✅ Successfully purchased ${pkg.coins} coins!`);
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
          Purchase Coins
        </h1>

        <p className="text-center text-gray-300 mb-2">
          Coins are used to redeem clothing items on SwapX.
        </p>
        <p className="text-center text-lg font-medium mb-8">
          Current Balance: <span className="text-green-400">{coins} Coins</span>
        </p>

        {message && (
          <p className="text-center text-green-500 mb-6 font-medium">{message}</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow hover:shadow-red-600 transition-shadow"
            >
              <h2 className="text-xl font-bold text-red-500 mb-2">
                {pkg.coins} Coins
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                ₹{pkg.price} INR
              </p>
              <button
                onClick={() => handlePurchase(pkg)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          Need help? <span className="text-red-500 underline cursor-pointer">Contact Support</span>
        </div>
      </div>
    </main>
  );
}
