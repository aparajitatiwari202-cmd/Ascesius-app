import React, { useState } from 'react';
import Link from 'next/link';
import GrievanceGuard from '../components/GrievanceGuard';

export default function GrievancePortal() {
  const [activeReports, setActiveReports] = useState([
    {
      id: 'G-1082',
      title: 'Hostel Washroom Geyser Hazard',
      submittedAt: 'Aug 31, 6:08 PM',
      severity: 'High Severity',
      category: 'Maintenance',
      status: 'under_review',
      reviewTime: 'Sept 1, 9:15 AM',
      assignedTo: 'Hostel Warden & Maintenance Cell.',
      estimatedCompletion: 'Sept 4.'
    }
  ]);

  const handleNewTicket = (cleanedPayload, isSOS) => {
    const newEntry = {
      id: `G-${Math.floor(1000 + Math.random() * 9000)}`,
      title: cleanedPayload.slice(0, 32) + '...',
      submittedAt: 'Just now',
      severity: isSOS ? 'Critical Red-Alert' : 'Standard',
      category: isSOS ? 'Safety & Conduct' : 'Campus Infrastructure',
      status: 'submitted',
      reviewTime: 'Pending Review',
      assignedTo: 'Triage Queue',
      estimatedCompletion: 'Calculating...'
    };
    setActiveReports([newEntry, ...activeReports]);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Top White Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-wider text-[#003366]">
            ASCESIUS
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/servers" className="hover:text-[#003366]">Hub</Link>
          <Link href="/marketplace" className="hover:text-[#003366]">Barter</Link>
          <Link href="/admin" className="hover:text-[#003366]">Admin Desk</Link>
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
            A
          </div>
        </nav>
      </header>

      {/* Navy Blue Hero Banner with Verified Shield */}
      <section className="bg-[#003366] text-white px-6 py-8 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Anonymous Grievance & Safety Report
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Your privacy is guaranteed; no personal identity is stored or shared.
            </p>
          </div>

          {/* Gold Shield Badge */}
          <div className="bg-[#f59e0b] border-2 border-amber-300 text-[#002244] px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg select-none">
            <div className="p-1 bg-[#002244] text-[#f59e0b] rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-.553.168l-6 4A1 1 0 003 7v5c0 4.418 3.582 8 8 8s8-3.582 8-8V7a1 1 0 00-.447-.832l-6-4A1 1 0 0010 2zm0 8a2 2 0 100-4 2 2 0 000 4zm-1 3a1 1 0 112 0v1a1 1 0 11-2 0v-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">Verified Institutional Domain</div>
              <div className="text-xs font-black tracking-wide">ANONYMOUS VERIFIED STUDENT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Container */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Scrubber Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <GrievanceGuard onSubmitTicket={handleNewTicket} />
          </div>

          {/* Right Column: Active Reports & Audit Stepper Trail */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-4">
              Your Active Reports & Audit Trail
            </h3>

            {activeReports.map((report) => (
              <div key={report.id} className="space-y-4">
                
                {/* Ticket Header & Severity Pill */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-xs text-slate-800 leading-snug">
                    Ticket #{report.id}: {report.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>Submitted {report.submittedAt}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {report.severity} | {report.category}
                    </span>
                  </div>
                </div>

                {/* Vertical Stepper */}
                <div className="relative pl-6 space-y-6 pt-2">
                  
                  {/* Step 1: Submitted */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div className="border-l-2 border-slate-300 absolute -left-4 top-4 h-full"></div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      Submitted <span className="text-emerald-600 text-xs">✓</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{report.submittedAt}</div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Grievance received and encrypted (PII removed).
                    </p>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center">
                    </div>
                    <div className="border-l-2 border-slate-200 absolute -left-4 top-4 h-full"></div>
                    <div className="font-bold text-xs text-slate-800">
                      Under Review
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{report.reviewTime}</div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Assigned to: {report.assignedTo}
                    </p>
                  </div>

                  {/* Step 3: Action Taken */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-slate-300 bg-white"></div>
                    <div className="font-bold text-xs text-slate-400">
                      Action Taken
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Estimated Completion: {report.estimatedCompletion}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}