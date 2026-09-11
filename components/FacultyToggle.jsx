import { useState } from 'react';

export default function FacultyToggle({ facultyName = 'Prof. R. Sharma', onSign }) {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    if (signed) return;
    setSigned(true);
    if (onSign) onSign();
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">Step 3 - Faculty Digital Approval</p>
        {!signed ? (
          <p className="mt-1 text-base font-semibold text-yellow-600">
            Pending ({facultyName})
          </p>
        ) : (
          <p className="mt-1 text-base font-semibold text-green-600">
            Cryptographically Signed and Dispatched to Counter 3
          </p>
        )}
      </div>

      <button
        onClick={handleSign}
        disabled={signed}
        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition
          ${signed
            ? 'cursor-not-allowed bg-green-500'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
      >
        {signed ? 'Signed' : '1-Tap Ed25519 Sign & Auto-Forward'}
      </button>
    </div>
  );
}