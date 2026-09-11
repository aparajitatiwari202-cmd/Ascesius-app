import { useState, useEffect } from 'react';
import FacultyToggle from '../components/FacultyToggle';

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
  ' migration': {
    label: ' Migration Form',
    faculty: 'Prof. R. Sharma',
    counter: 'Counter 3',
    document: 'migration_form.pdf',
  },
  migration: {
    label: 'Migration Form',
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

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-gray-50 px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Clearance Pipeline</h1>
      <p className="mt-1 text-sm text-gray-500">
        Verified: {currentUser.name} ({currentUser.rollNumber})
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a clearance, e.g. 'GE migration'"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Find
        </button>
      </form>

      {notFound && (
        <p className="mt-3 text-sm text-red-500">
          No matching workflow. Try "migration", "medical", "library due", or "bonafide".
        </p>
      )}

      {workflow && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">{workflow.label}</h2>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Step 1 - Automated Prerequisites</p>
            <p className={`mt-1 text-base font-semibold ${prereqsPassed ? 'text-green-600' : 'text-red-500'}`}>
              {prereqsPassed
                ? `Passed: attendance ${currentUser.attendance}%, 0 dues`
                : `Failed: attendance ${currentUser.attendance}%, dues pending`}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Step 2 - Uploaded Document</p>
                <p className={`mt-1 text-base font-semibold ${documentUploaded ? 'text-green-600' : 'text-yellow-600'}`}>
                  {documentUploaded ? `${workflow.document} - Verified` : `${workflow.document} - Awaiting upload`}
                </p>
              </div>
              {!documentUploaded && (
                <button
                  onClick={() => setDocumentUploaded(true)}
                  className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-900"
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

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Step 4 - Admin Section Sync</p>
            <p className={`mt-1 text-base font-semibold ${adminSynced ? 'text-green-600' : 'text-gray-400'}`}>
              {adminSynced ? `Status updated - ${workflow.counter} dispatched` : 'Waiting on faculty sign-off'}
            </p>
             </div>                                                                                                                             
        </div>
      )}
    </div>
    );
}
