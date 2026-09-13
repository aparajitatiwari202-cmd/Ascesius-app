import React, { useState } from "react";
import Navbar from "../components/Navbar";
import mockData from "../data/mockData.json";

export default function Marketplace() {
  const [coins, setCoins] = useState(mockData?.currentUser?.coins ?? 150);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const initialItems = [
    {
      id: "note-1",
      title: "Wave Optics Handwritten Notes",
      category: "Study Notes",
      price: 25,
      icon: "📘",
      aiSummary: "Comprehensive coverage of Huygens Principle, Michelson Interferometer setups, and 2024 numerical practicals."
    },
    {
      id: "calc-2",
      title: "Casio fx-991EX ClassWiz Calculator",
      category: "Calculators",
      price: 10,
      icon: "🧮",
      aiSummary: "Pre-owned matrix and vector solver with solar cell backup. Minimal wear, fully verified."
    },
    {
      id: "bottle-3",
      title: "Insulated Stainless Steel Flask (750ml)",
      category: "Hardware",
      price: 70,
      icon: "🧴",
      aiSummary: "Double-walled vacuum thermal flask. Keeps hot beverages for 12 hours, zero dents or leakage."
    }
  ];

  const [items, setItems] = useState(initialItems);

  const categories = ["Study Notes", "Books", "Calculators", "Hardware", "Essentials"];

  const filteredItems = items.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleUnlock = (item) => {
    if (coins < item.price) {
      alert("Insufficient coin balance!");
      return;
    }
    setCoins((prev) => prev - item.price);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#202952] text-white font-sans selection:bg-[#F4C542]">
      {/* 1. Global Navigation Bar */}
      <Navbar coins={coins} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 2. Graphic Study Ribbon Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-[#171e3d] p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <span className="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                ⚡ Graphic Study Ribbon
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Study Together. Trade Smarter.
              </h2>
              <p className="text-xs text-blue-100/70">
                Verified top-ranker booklets, scientific calculators, and essential campus gear.
              </p>
            </div>

            {/* Study Photo Windows */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-28 w-36 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80"
                  alt="Students Studying"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-28 w-36 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                  alt="Library Group Study"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Inset Neumorphic Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="[ Center Inset Neumorphic Search Bar... ]"
              className="w-full rounded-2xl bg-[#202952] px-5 py-3 pl-12 text-sm text-white placeholder-blue-200/40 outline-none shadow-[inset_4px_4px_8px_#151a34,inset_-4px_-4px_8px_#2b3870] border border-white/5 focus:border-amber-400/50"
            />
            <span className="absolute left-4 top-3 text-sm text-blue-200/50">🔍</span>
          </div>
        </div>

        {/* 4. Split Section: Categories + Neumorphic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column: Category Filter */}
          <aside className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200/60 px-2">
              Categories
            </h3>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`w-full text-left text-xs font-semibold px-4 py-3 rounded-2xl transition border ${
                selectedCategory === "All"
                  ? "bg-[#202952] border-amber-400/60 shadow-[4px_4px_10px_#151a34,-4px_-4px_10px_#2b3870] text-amber-300"
                  : "bg-[#202952] border-white/5 text-blue-100/70 hover:text-white shadow-[2px_2px_6px_#151a34,-2px_-2px_6px_#2b3870]"
              }`}
            >
              📁 All Resources
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left text-xs font-semibold px-4 py-3 rounded-2xl transition border ${
                  selectedCategory === cat
                    ? "bg-[#202952] border-amber-400/60 shadow-[4px_4px_10px_#151a34,-4px_-4px_10px_#2b3870] text-amber-300"
                    : "bg-[#202952] border-white/5 text-blue-100/70 hover:text-white shadow-[2px_2px_6px_#151a34,-2px_-2px_6px_#2b3870]"
                }`}
              >
                📁 {cat}
              </button>
            ))}
          </aside>

          {/* Right Column: Product Cards Grid */}
          <section className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#202952] rounded-3xl p-5 border border-amber-400/40 shadow-[6px_6px_14px_#141933,-6px_-6px_14px_#2c3971] flex flex-col justify-between hover:-translate-y-1 transition"
              >
                <div>
                  <div className="h-40 rounded-2xl bg-[#171e3d] flex items-center justify-center text-5xl mb-4 border border-white/5 shadow-inner">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-[11px] text-blue-200/60 mt-1 line-clamp-2">
                    🤖 {item.aiSummary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">
                    🪙 {item.price} Coins
                  </span>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-xs font-bold bg-[#171e3d] text-white px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-amber-400/60 transition"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Unlock / Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171e3d] border border-amber-400/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <h2 className="text-lg font-black">{selectedItem.title}</h2>
            <div className="p-3 bg-[#202952] rounded-xl border border-white/5 text-xs text-blue-100">
              <strong className="block mb-1 text-amber-300">🤖 AI Summary Preview:</strong>
              {selectedItem.aiSummary}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleUnlock(selectedItem)}
                className="flex-1 bg-[#F4C542] text-[#17254D] text-xs font-black py-2.5 rounded-xl transition"
              >
                Confirm Unlock (-{selectedItem.price} Coins)
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 border border-white/20 text-xs font-bold rounded-xl text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}