import { useState } from "react";
import mockData from "../data/mockData.json";


import ResumeReviewFeed from "../components/ResumeReviewFeed";
import LostFoundCard from "../components/LostFoundCard";

const CHANNELS = [
  { id: "resume-review", label: "#resume-review" },
  { id: "hackathons", label: "#hackathons" },
  { id: "interview-prep", label: "#interview-prep" },
  { id: "smart-lost-and-found", label: "#smart-lost-and-found" },
];

export default function Servers() {
  const [channels, setChannels] = useState(CHANNELS);
  const [activeRoom, setActiveRoom] = useState("hackathons");
  const [agentTriggered, setAgentTriggered] = useState(false);

  const handleTriggerAgent = () => {
    if (agentTriggered) return; // prevent duplicate channel adds
    setChannels((prev) => [
      ...prev,
      { id: "sih-cohort-2026", label: "#sih-cohort-2026" },
    ]);
    setAgentTriggered(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Collaboration Hub
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveRoom(channel.id)}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                activeRoom === channel.id
                  ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {channel.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleTriggerAgent}
            disabled={agentTriggered}
            className={`w-full text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
              agentTriggered
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            🤖 Trigger Trend Scout Agent
          </button>
        </div>
      </aside>

      {/* Main room area */}
      <main className="flex-1 overflow-y-auto p-6">
        {activeRoom === "hackathons" && <HackathonsRoom data={mockData?.hackathons} />}
        {activeRoom === "resume-review" && <ResumeReviewRoom />}
        {activeRoom === "smart-lost-and-found" && <LostAndFoundRoom />}
        {activeRoom === "interview-prep" && <InterviewPrepRoom />}
        {activeRoom === "sih-cohort-2026" && <SihCohortRoom />}
      </main>
    </div>
  );
}

// ---------- Room components ----------

function HackathonsRoom({ data }) {
  const hackathons = data?.length
    ? data
    : [
        {
          id: 1,
          name: "SIH Internal Hackathon",
          date: "2026-09-20",
          teamSize: "4-6",
          tags: ["AI", "Open Innovation"],
        },
        {
          id: 2,
          name: "CodeStorm 2026",
          date: "2026-10-05",
          teamSize: "2-4",
          tags: ["Web3", "Fintech"],
        },
      ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">#hackathons</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {hackathons.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
  <h3 className="font-semibold text-gray-800">{h.title}</h3>
  <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
    {h.date}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Team size: {h.teamSize}</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {h.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
              Form Cohort
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeReviewRoom() {
  return <ResumeReviewFeed />;
}

function LostAndFoundRoom() {
  return <LostFoundCard />;
}

function InterviewPrepRoom() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">#interview-prep</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500">
        Coming soon — mock interview Q&A drops here.
      </div>
    </div>
  );
}

function SihCohortRoom() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">#sih-cohort-2026</h1>
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6 text-sm text-indigo-700">
        🤖 Trend Scout Agent spun up this room based on recent SIH 2026 activity.
      </div>
    </div>
  );
}
