// pages/admin.jsx
import { useState, useEffect } from 'react';
import FacultyToggle from '../components/FacultyToggle';
import Navbar from '../components/Navbar';

let sharedMock = null;
try {
  sharedMock = require('../data/mockData.json');
} catch (e) {
  sharedMock = null;
}

const FALLBACK_USER = {
  name: 'Anshika Yadav',
  rollNumber: '23CS045',
  attendance: 74.2,
  dues: 0,
};

const currentUser = sharedMock?.currentUser || FALLBACK_USER;


const CLEARANCE_DICTIONARY = {
  'ge migration': {
    label: 'GE Migration Form',
    faculty: 'Prof. R. Sharma',
    counter: 'Counter 3',
    document: 'migration_form.pdf',
  },
  migration: {
    label: 'GE Migration Form',
    faculty: 'Prof. R. Sharma',
    counter: 'Counter 3',
    document: 'migration_form.pdf',
  },
  medical: {
    label: 'Medical Leave Clearance',
    faculty: 'Dr. Verma',
    counter: 'Counter 2',
    document: 'medical_certificate.pdf',
  },
  'library due': {
    label: 'Library No-Dues Certificate',
    faculty: 'Librarian - Mr. Kapoor',
    counter: 'Counter 1',
    document: 'library_noc.pdf',
  },
  bonafide: {
    label: 'Bonafide Certificate Request',
    faculty: 'Prof. R. Sharma',
    counter: 'Counter 3',
    document: 'bonafide_request.pdf',
  },
};

function findWorkflow(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (CLEARANCE_DICTIONARY[q]) return CLEARANCE_DICTIONARY[q];
  const key = Object.keys(CLEARANCE_DICTIONARY).find(
    (k) => q.includes(k) || k.includes(q)
  );
  return key ? CLEARANCE_DICTIONARY[key] : null;
}

export default function AdminClearancePipeline() {
  const [query, setQuery] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [facultySigned, setFacultySigned] = useState(false);
  const [adminSynced, setAdminSynced] = useState(false);

  const prereqsPassed = currentUser.attendance > 67 && currentUser.dues === 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const result = findWorkflow(query);
    setWorkflow(result);
    setNotFound(!result);
    setDocumentUploaded(false);
    setFacultySigned(false);
    setAdminSynced(false);
  };

  useEffect(() => {
    if (facultySigned) {
      const t = setTimeout(() => setAdminSynced(true), 900);
      return () => clearTimeout(t);
    }
  }, [facultySigned]);

  const completedSteps =
    (prereqsPassed ? 1 : 0) +
    (documentUploaded ? 1 : 0) +
    (facultySigned ? 1 : 0) +
    (adminSynced ? 1 : 0);
  const progress = workflow ? Math.round((completedSteps / 4) * 100) : 0;

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/60">
      <Navbar />
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Registrar&apos;s Office
              </p>
              <p className="text-xs text-slate-500">Student Clearance Portal</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline">
            System Online
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Admin Clearance Pipeline
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and process student clearance workflows end to end.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ring-1 ring-slate-900/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">
                Roll No. {currentUser.rollNumber}
              </p>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
              Verified
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm ring-1 ring-slate-900/5 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a clearance, e.g. 'GE migration'"
              className="w-full rounded-xl border border-transparent bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            Find
          </button>
        </form>

        {notFound && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <svg
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>
              No matching workflow. Try &quot;migration&quot;, &quot;medical&quot;,
              &quot;library due&quot;, or &quot;bonafide&quot;.
            </span>
          </div>
        )}

        {workflow && (
          <div className="mt-8">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Active Workflow
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {workflow.label}
                </h2>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-medium text-slate-500">
                  {completedSteps} of 4 steps
                </p>
                <div className="mt-1.5 h-2 w-full min-w-[9rem] overflow-hidden rounded-full bg-slate-100 sm:w-40">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      prereqsPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    1
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Automated Prerequisites
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        prereqsPassed ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {prereqsPassed
                        ? `Passed: attendance ${currentUser.attendance}%, 0 dues`
                        : `Failed: attendance ${currentUser.attendance}%, dues pending`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        documentUploaded
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      2
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Uploaded Document
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          documentUploaded ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {documentUploaded
                          ? `${workflow.document} - Verified`
                          : `${workflow.document} - Awaiting upload`}
                      </p>
                    </div>
                  </div>
                  {!documentUploaded && (
                    <button
                      onClick={() => setDocumentUploaded(true)}
                      className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                      Simulate Upload
                    </button>
                  )}
                </div>
              </div>

              {documentUploaded && (
                <FacultyToggle
                  facultyName={workflow.faculty}
                  onSign={() => setFacultySigned(true)}
                />
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      adminSynced
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    4
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Admin Section Sync
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        adminSynced ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {adminSynced
                        ? `Status updated - ${workflow.counter} dispatched`
                        : 'Waiting on faculty sign-off'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}