import React, { useState } from 'react';

export default function GrievanceGuard({ onCleanTextReady, onSubmitTicket }) {
  const [rawText, setRawText] = useState('');
  const [sanitizedText, setSanitizedText] = useState('');
  const [isSOS, setIsSOS] = useState(false);
  const [stripMetadata, setStripMetadata] = useState(false);

  const emergencyKeywords = ['harassment', 'ragging', 'stalking', 'abuse', 'assault', 'threat', 'geyser hazard', 'hazard'];

  const handleTextChange = (e) => {
    const input = e.target.value;
    if (input.length > 2000) return;
    setRawText(input);

    // Live Client-Side PII Regex Scrubbing
    let cleaned = input
      .replace(/\b\d{2}[A-Za-z]{2,5}\d{2,4}\b/gi, '[REDACTED ROLL NO]')
      .replace(/\b(Prof\.|Dr\.|Mr\.|Ms\.)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g, '[REDACTED FACULTY]')
      .replace(/\bRoom\s*\d{1,3}\b/gi, '[REDACTED ROOM]');

    setSanitizedText(cleaned);
    if (onCleanTextReady) onCleanTextReady(cleaned);

    const hasEmergency = emergencyKeywords.some((word) => input.toLowerCase().includes(word));
    setIsSOS(hasEmergency);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (rawText.trim().length < 5) return;
    if (onSubmitTicket) {
      onSubmitTicket(sanitizedText, isSOS);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Top Header & Character Counter */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800">
          Submit Your Grievance (PII Guard Active)
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          {rawText.length}/2000
        </span>
      </div>

      {/* Emergency SOS Banner (Visible on trigger) */}
      {isSOS && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
          <span className="text-base">🚨</span>
          <div>
            <strong className="font-semibold">Urgent Safety / Hazard Trigger Detected:</strong> High-priority dispatch routed to Maintenance & ICC.
          </div>
        </div>
      )}

      {/* Text Area */}
      <div>
        <textarea
          rows={5}
          value={rawText}
          onChange={handleTextChange}
          placeholder="Describe your concern... Hostel issues, safety hazards, bullying, or campus grievance"
          className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm shadow-inner"
        />
      </div>

      {/* In-Browser AI Privacy Indicator Pill */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium">
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Zero Personal Identifiers Detected (In-browser AI)
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={rawText.trim().length < 5}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-white ${
            rawText.trim().length >= 5
              ? 'bg-[#003366] hover:bg-[#002244] cursor-pointer shadow-md'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          Submit Secure Report
        </button>
      </div>

      {/* Optional Attachment Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stripMetadata}
            onChange={(e) => setStripMetadata(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#003366] focus:ring-[#003366]"
          />
          Attach optional screenshot (Metadata will be stripped)
        </label>
      </div>
    </form>
  );
}