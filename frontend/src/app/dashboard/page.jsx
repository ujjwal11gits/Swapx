"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // "profile", "coins", "logout"
    const [addItemLoading, setAddItemLoading] = useState(false);
    const [addItemError, setAddItemError] = useState("");
    const [newItem, setNewItem] = useState({
        title: "",
        condition: "",
        imageUrl: "",
        description: "",
        price: "",
    });

    // Items state
    const [listedItems, setListedItems] = useState([]);
    const [ongoingSwaps, setOngoingSwaps] = useState([]);
    const [completedSwaps, setCompletedSwaps] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        // Fetch user info
        fetch("http://localhost:5000/api/auth/me", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fetch listed items
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://localhost:5000/api/items/my-products", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setListedItems(data))
            .catch(() => setListedItems([]));
    }, [modalOpen]); // refetch after modal closes (add item)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Ongoing swaps (available)
        fetch("http://localhost:5000/api/items/my-products/available", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setOngoingSwaps(data))
            .catch(() => setOngoingSwaps([]));

        // Completed swaps (purchased)
        fetch("http://localhost:5000/api/items/my-products/purchased", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setCompletedSwaps(data))
            .catch(() => setCompletedSwaps([]));
    }, []);

    const handleAddItem = async () => {
        setAddItemLoading(true);
        setAddItemError("");
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/items/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newItem.title,
                    description: newItem.description,
                    image: newItem.imageUrl,
                    price: newItem.price,
                    condition: newItem.condition,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAddItemError(data.message || "Failed to add item");
                setAddItemLoading(false);
                return;
            }
            closeModal();
            setNewItem({
                title: "",
                condition: "",
                imageUrl: "",
                description: "",
                price: "",
            });
        } catch (err) {
            setAddItemError("Server error");
        }
        setAddItemLoading(false);
    };

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType("");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white py-10 px-4">
                Loading...
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-black text-white py-10 px-4">
                User not found or not logged in.
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Profile */}
                <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 shadow-lg border border-red-600 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-red-600 shadow-lg bg-gray-700 flex items-center justify-center">
                            <Image
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eEWi_zPNrq5KlXXP3SXlIKKMWfpVVEsmNQ&s"
                                alt={user.name}
                                width={112}
                                height={112}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 w-full">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-red-600 mb-2 text-center sm:text-left">
                            Welcome, {user.name}!
                        </h2>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-lg">
                            <div>
                                <span className="font-semibold text-gray-300">Email:</span>
                                <span className="ml-2 text-white break-all">{user.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-300">Role:</span>
                                <span className="ml-2 text-white capitalize">{user.role}</span>
                            </div>
                            <div>
                                <span
                                    className="ml-2 text-yellow-400 font-bold cursor-pointer hover:text-yellow-300"
                                    onClick={() => openModal("coins")}
                                >
                                    {user.coins} ✨
                                </span>
                            </div>
                            <div>
                                <button
                                    onClick={() => openModal("profile")}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                            <Link href="/" className="w-full sm:w-auto">
                                <span className="block text-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow transition">
                                    ← Back to Home
                                </span>
                            </Link>
                            <button
                                onClick={() => openModal("logout")}
                                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </section>

                {/* Items and swaps sections */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-red-600">
                            Your Listed Items
                        </h2>
                        <div>
                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                onClick={() => openModal("addItem")}
                                disabled={addItemLoading}
                            >
                                {addItemLoading ? "Adding..." : "Add Item"}
                            </button>
                            {addItemError && (
                                <div className="text-red-500 text-sm mt-2">{addItemError}</div>
                            )}
                        </div>
                    </div>
                    {listedItems.length === 0 ? (
                        <p className="text-gray-400">You haven't listed any items yet.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {listedItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={item.image || item.imageUrl || "/placeholder.png"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            Condition: {item.condition}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Description: {item.description}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Price: {item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-red-600 mb-3">Ongoing Swaps</h2>
                    {ongoingSwaps.length === 0 ? (
                        <p className="text-gray-400">No ongoing swaps.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {ongoingSwaps.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={item.image || item.imageUrl || "/placeholder.png"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            Condition: {item.condition}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Description: {item.description}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Price: {item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-red-600 mb-3">
                        Completed Swaps
                    </h2>
                    {completedSwaps.length === 0 ? (
                        <p className="text-gray-400">
                            You haven't completed any swaps yet.
                        </p>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {completedSwaps.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={item.image || item.imageUrl || "/placeholder.png"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            Condition: {item.condition}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Description: {item.description}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Price: {item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border border-red-600 rounded-xl p-6 w-full max-w-md mx-auto relative animate-scale-in">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* Modal Content Based on Type */}
                            {modalType === "profile" && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-4">
                                        Edit Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={user.name}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={closeModal}
                                                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === "coins" && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-4">
                                        Coin Balance
                                    </h3>
                                    <div className="text-center py-6">
                                        <div className="text-6xl text-yellow-400 mb-4">✨</div>
                                        <p className="text-3xl font-bold text-yellow-400 mb-2">
                                            {user.coins} Coins
                                        </p>
                                        <p className="text-gray-400 mb-6">
                                            Use coins to redeem items without swapping
                                        </p>
                                        <div className="space-y-3">
                                            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors">
                                                Buy More Coins
                                            </button>
                                            <button
                                                onClick={closeModal}
                                                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === "logout" && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-4">
                                        Confirm Logout
                                    </h3>
                                    <p className="text-gray-300 mb-6">
                                        Are you sure you want to logout? You'll need to sign in again
                                        to access your dashboard.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleLogout}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Yes, Logout
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalType === "addItem" && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-4">
                                        Add New Item
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Item Title
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            placeholder="Enter item title"
                                            value={newItem.title}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, title: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Condition
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            placeholder="Enter condition"
                                            value={newItem.condition}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, condition: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            placeholder="Enter image URL"
                                            value={newItem.imageUrl}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, imageUrl: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-600 focus:outline-none"
                                            placeholder="Enter price"
                                            value={newItem.price}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, price: e.target.value })
                                            }
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                            onClick={handleAddItem}
                                            disabled={addItemLoading}
                                        >
                                            {addItemLoading ? "Adding..." : "Add Item"}
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </main>
    );
}
