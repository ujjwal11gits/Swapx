"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ItemDetailPage() {
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const userCoins = 20;

  useEffect(() => {
    async function fetchItemAndOwner() {
      try {
        const itemId = localStorage.getItem("selectedItemId");
        if (!itemId) throw new Error("No item ID found in localStorage");
        const res = await fetch(`http://localhost:5000/api/items/${itemId}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();

        setItem({
          _id: data._id,
          title: data.title,
          description: data.description,
          imageUrl: data.image,
          isAvailable: data.isAvailable ?? true,
          redeemPoints: data.redeemPoints ?? 30,
          condition: data.condition ?? "Like New",
          size: data.size ?? "L",
          category: data.category ?? "Men",
          type: data.type ?? "Hoodie",
          tags: data.tags ?? ["winter", "hoodie", "red"],
          ownerId: data.owner,
        });

        const token = localStorage.getItem("token");
        const ownerRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const ownerData = await ownerRes.json();
        setOwner(ownerData.user);
      } catch (err) {
        setItem({
          _id: "6871f30286710875c0781b72",
          title: "Redmi Note 12",
          description: "Slightly used, great condition",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eEWi_zPNrq5KlXXP3SXlIKKMWfpVVEsmNQ&s",
          isAvailable: true,
          redeemPoints: 30,
          condition: "Like New",
          size: "L",
          category: "Men",
          type: "Hoodie",
          tags: ["winter", "hoodie", "red"],
          ownerId: "6871ef0bea001ce631dc9fa0",
        });
        setOwner({
          name: "Tanmay Gupta",
          email: "tanmay@example.com",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchItemAndOwner();
  }, []);

  if (loading || !item) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <span>Loading...</span>
      </main>
    );
  }

  const hasEnoughCoins = userCoins >= item.redeemPoints;

  const handleRedeem = async () => {
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/items/${item._id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Purchase successful using coins!");
        setItem({ ...item, isAvailable: false });
      } else if (res.status === 402) {
        setFeedback(`Insufficient coins. You need ${data.requiredCoins} more coins.`);
      } else {
        setFeedback(data.message || "Purchase failed.");
      }
    } catch (err) {
      setFeedback("Server error. Please try again.");
    }
  };

  const handleSwapRequest = async () => {
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/items/${item._id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Swap request successful!");
        setItem({ ...item, isAvailable: false });
      } else {
        setFeedback(data.message || "Swap request failed.");
      }
    } catch (err) {
      setFeedback("Server error during swap.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-80 rounded-lg overflow-hidden shadow border border-gray-700">
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow border-4 border-red-600">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-red-600">{item.title}</h1>
          <p className="text-gray-300">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Size:</strong> {item.size}</p>
            <p><strong>Condition:</strong> {item.condition}</p>
           <p><strong>Status:</strong> <span className={item.isPurchased ? "text-red-400" : "text-green-500"}>{item.isPurchased ? "Unavailable" : "Available"}</span></p>

            <p><strong>Redeem Points:</strong> {item.redeemPoints}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs bg-red-700 px-2 py-1 rounded-full text-white">#{tag}</span>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-400 border-t border-gray-700 pt-4">
            <p><strong>Uploaded by:</strong> {owner?.name || "Unknown"}</p>
            <p><strong>Contact:</strong> {owner?.email || "Unknown"}</p>
          </div>

          {item.isAvailable && (
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white transition-colors cursor-pointer"
                onClick={handleSwapRequest}
              >
                Request Swap
              </button>
              {hasEnoughCoins ? (
                <button
                  className="border border-red-600 hover:bg-red-700 hover:text-white px-6 py-2 rounded text-red-500 transition-colors cursor-pointer"
                  onClick={handleRedeem}
                >
                  Redeem via Points
                </button>
              ) : (
                <button
                  className="px-6 py-2 rounded text-red-400 border border-red-600 bg-gray-900 cursor-pointer"
                  onClick={() => window.location.href = "/Purchase"}
                >
                  Purchase coins
                </button>
              )}
            </div>
          )}

          {feedback && (
            <div className="mt-4 text-sm text-yellow-400">{feedback}</div>
          )}
        </div>
      </div>
    </main>
  );
}
