import { useState } from "react";
import Link from "next/link";

const currentUser = {
  name: "Eram Fatima",
  course: "B.Sc. Physical Science with Computer Science",
  year: "2nd Year",
  rollNo: "2024PSC001",
};

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-[#202952] px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">

        <div className="shrink-0">
          <Link href="/">
            <h1 className="text-2xl font-bold tracking-wide">
              Ascesius
            </h1>
          </Link>

          <p className="text-sm text-blue-200">
            Maitreyi Hub
          </p>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">

          <Link
            href="/"
            className="text-sm font-medium transition hover:text-yellow-300"
          >
            Home
          </Link>

          <Link
            href="/servers"
            className="text-sm font-medium transition hover:text-yellow-300"
          >
            Servers
          </Link>

          <Link
            href="/marketplace"
            className="text-sm font-medium transition hover:text-yellow-300"
          >
            Marketplace
          </Link>

          <Link
            href="/admin"
            className="text-sm font-medium transition hover:text-yellow-300"
          >
            Admin
          </Link>

          <Link
            href="/grievance"
            className="text-sm font-medium transition hover:text-yellow-300"
          >
            Grievance
          </Link>

        </nav>
        <div className="relative shrink-0">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="rounded-full bg-[#F4C542] px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-300"
          >
            🪙 150 Coins
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl bg-white p-5 text-gray-900 shadow-xl">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#72C7C9] text-xl">
                  👤
                </div>

                <div>
                  <h3 className="font-bold">
                    {currentUser.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Student
                  </p>
                </div>

              </div>


              <div className="space-y-3 border-t pt-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Course
                  </p>

                  <p className="text-sm font-medium">
                    {currentUser.course}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-gray-500">
                    Year
                  </p>

                  <p className="text-sm font-medium">
                    {currentUser.year}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-gray-500">
                    Roll Number
                  </p>

                  <p className="text-sm font-medium">
                    {currentUser.rollNo}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-gray-500">
                    Wallet Balance
                  </p>

                  <p className="text-sm font-bold">
                    🪙 150 Coins
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}