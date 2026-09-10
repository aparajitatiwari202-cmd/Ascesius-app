import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import mockData from "../data/mockData.json";

export default function Home() {
  const [search, setSearch] = useState("");

  // Safe fallbacks to prevent runtime crashes
  const noticesList = mockData?.notices || mockData?.deadlines || [];
  const circularsList = mockData?.circulars || mockData?.notices || [];
  const walletCoins = mockData?.currentUser?.coins ?? 150;

  // Filtered Deadlines
  const filteredDeadlines = noticesList.filter((item) =>
    `${item.title || ""} ${item.description || ""} ${item.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Filtered Circulars
  const filteredCirculars = circularsList.filter((item) =>
    `${item.title || ""} ${item.description || item.deadline || ""} ${item.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Verified circulars count (defaults to total notices if 'verified' flag is absent)
  const verifiedCount = circularsList.filter((item) => item.verified).length || circularsList.length;

  const getBadgeStyle = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("exam")) {
      return "bg-red-500 text-white";
    }
    if (cat.includes("society") || cat.includes("hackathon")) {
      return "bg-yellow-400 text-gray-900";
    }
    if (cat.includes("scholarship")) {
      return "bg-green-500 text-white";
    }
    return "bg-blue-500 text-white";
  };

  return (
    <main className="min-h-screen bg-[#DCEAF3] text-gray-900">
      <Navbar />

      {/* Universal Search Bar */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ask anything: form, notes, circular query..."
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 shadow-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Daily Pulse Banner */}
        <section className="mb-8 rounded-3xl bg-[#F4C542] p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-700">
                Daily Pulse
              </p>
              <h2 className="text-3xl font-bold text-[#17254D]">
                Your campus, at a glance.
              </h2>
              <p className="mt-2 max-w-2xl text-gray-700">
                Stay updated with deadlines, campus notices, scholarships,
                events and everything happening around Maitreyi Hub.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-5 text-center">
              <p className="text-sm text-gray-600">Upcoming deadlines</p>
              <p className="text-4xl font-bold text-[#17254D]">
                {noticesList.length}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="mb-8 flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Deadlines</p>
            <p className="mt-1 text-3xl font-bold text-[#17254D]">
              {noticesList.length}
            </p>
          </div>

          <div className="min-w-[200px] flex-1 rounded-2xl bg-[#72C7C9] p-5 shadow-sm">
            <p className="text-sm text-gray-700">Verified Circulars</p>
            <p className="mt-1 text-3xl font-bold text-[#17254D]">
              {verifiedCount}
            </p>
          </div>

          <div className="min-w-[200px] flex-1 rounded-2xl bg-[#C9CCE9] p-5 shadow-sm">
            <p className="text-sm text-gray-700">Wallet Balance</p>
            <p className="mt-1 text-3xl font-bold text-[#17254D]">
              🪙 {walletCoins}
            </p>
          </div>
        </section>

        {/* Deadline Radar */}
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Stay ahead
              </p>
              <h2 className="text-2xl font-bold text-[#17254D]">
                Deadline Radar
              </h2>
            </div>
            <span className="rounded-full bg-[#17254D] px-4 py-2 text-xs font-semibold text-white">
              {filteredDeadlines.length} upcoming
            </span>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3">
            {filteredDeadlines.length > 0 ? (
              filteredDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="min-w-[270px] flex-1 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyle(
                        deadline.category
                      )}`}
                    >
                      {deadline.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      {deadline.deadline || deadline.date || "Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#17254D]">
                    {deadline.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {deadline.description || `Action required before ${deadline.deadline || "deadline"}.`}
                  </p>

                  <Link href={deadline.actionUrl || "#"}>
                    <button className="mt-5 rounded-lg bg-[#17254D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#263768]">
                      View Details
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full rounded-2xl bg-white p-8 text-center">
                <p className="font-semibold text-gray-600">No deadlines found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Access Navigation */}
        <section className="mb-10">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Explore Platform
            </p>
            <h2 className="text-2xl font-bold text-[#17254D]">Quick Access</h2>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/servers"
              className="group min-w-[220px] flex-1 rounded-2xl bg-[#8CC9DD] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">🖥️</div>
              <h3 className="text-xl font-bold text-[#17254D]">Servers</h3>
              <p className="mt-2 text-sm text-gray-700">
                Join campus communities, study groups and discussions.
              </p>
              <p className="mt-4 font-semibold text-[#17254D] group-hover:underline">
                Explore →
              </p>
            </Link>

            <Link
              href="/marketplace"
              className="group min-w-[220px] flex-1 rounded-2xl bg-[#E4B5BE] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">🛍️</div>
              <h3 className="text-xl font-bold text-[#17254D]">Marketplace</h3>
              <p className="mt-2 text-sm text-gray-700">
                Buy, sell and exchange useful items with fellow students.
              </p>
              <p className="mt-4 font-semibold text-[#17254D] group-hover:underline">
                Visit Marketplace →
              </p>
            </Link>

            <Link
              href="/admin"
              className="group min-w-[220px] flex-1 rounded-2xl bg-[#C9CCE9] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">🏛️</div>
              <h3 className="text-xl font-bold text-[#17254D]">Admin Services</h3>
              <p className="mt-2 text-sm text-gray-700">
                Access forms, administrative services and campus support.
              </p>
              <p className="mt-4 font-semibold text-[#17254D] group-hover:underline">
                Open Services →
              </p>
            </Link>

            <Link
              href="/grievance"
              className="group min-w-[220px] flex-1 rounded-2xl bg-[#72C7C9] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">🛡️</div>
              <h3 className="text-xl font-bold text-[#17254D]">Grievance</h3>
              <p className="mt-2 text-sm text-gray-700">
                Raise concerns and access a safe campus reporting system.
              </p>
              <p className="mt-4 font-semibold text-[#17254D] group-hover:underline">
                Report Issue →
              </p>
            </Link>
          </div>
        </section>

        {/* Verified Circulars Feed */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Official Updates
              </p>
              <h2 className="text-2xl font-bold text-[#17254D]">
                Verified Campus Circulars
              </h2>
            </div>
            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm sm:block">
              ✓ Verified information
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {filteredCirculars.length > 0 ? (
              filteredCirculars.map((circular) => (
                <div
                  key={circular.id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#72C7C9] text-xl">
                      ✓
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#17254D]">
                          {circular.title}
                        </h3>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          Verified
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {circular.description || `Official notice: ${circular.title}.`}
                      </p>
                      <p className="mt-2 text-xs font-medium text-gray-400">
                        {circular.category} • {circular.deadline || circular.date || "Active"}
                      </p>
                    </div>
                  </div>

                  <button className="shrink-0 rounded-lg border border-[#17254D] px-4 py-2 text-sm font-semibold text-[#17254D] transition hover:bg-[#17254D] hover:text-white">
                    Read More
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="font-semibold text-gray-600">No circulars found.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="bg-[#17254D] px-6 py-6 text-center text-sm text-blue-200">
        <p>© 2026 Ascesius • Maitreyi Hub</p>
      </footer>
    </main>
  );
}