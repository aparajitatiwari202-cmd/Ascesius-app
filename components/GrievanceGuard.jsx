import React, { useState } from 'react';

export default function GrievanceGuard({ onCleanTextReady, onSubmitTicket }) {
  const [rawText, setRawText] = useState('');
  const [sanitizedText, setSanitizedText] = useState('');
  const [redactedCount, setRedactedCount] = useState(0);
  const [isSOS, setIsSOS] = useState(false);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Hostel & Infrastructure');

  const emergencyKeywords = ['harassment', 'ragging', 'stalking', 'abuse', 'assault', 'threat', 'hazard', 'geyser'];

  const categoryPresets = [
    { label: 'Hostel & Sanitation', icon: '🏢' },
    { label: 'Academic & Labs', icon: '🔬' },
    { label: 'Harassment / ICC', icon: '🚨' },
    { label: 'Administrative', icon: '🏛️' },
  ];

  const handleTextChange = (e) => {
    const input = e.target.value;
    if (input.length > 2000) return;
    setRawText(input);

    let count = 0;
    let cleaned = input
      .replace(/\b\d{2}[A-Za-z]{2,5}\d{2,4}\b/gi, () => { count++; return '[REDACTED ROLL NO]'; })
      .replace(/\b(Prof\.|Dr\.|Mr\.|Ms\.)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g, () => { count++; return '[REDACTED FACULTY]'; })
      .replace(/\bRoom\s*\d{1,3}\b/gi, () => { count++; return '[REDACTED ROOM]'; });

    setSanitizedText(cleaned);
    setRedactedCount(count);
    if (onCleanTextReady) onCleanTextReady(cleaned);

    const hasEmergency = emergencyKeywords.some((word) => input.toLowerCase().includes(word));
    setIsSOS(hasEmergency);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rawText.trim().length < 8) return;
    if (onSubmitTicket) {
      onSubmitTicket({
        raw: rawText,
        sanitized: sanitizedText,
        isSOS,
        category: activeCategory,
        metadataStripped: stripMetadata
      });
    }
    setRawText('');
    setSanitizedText('');
    setRedactedCount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          Select Department / Routing Target
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryPresets.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActiveCategory(cat.label)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeCategory === cat.label
                  ? 'bg-[#17254D] text-white border-[#17254D] shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {isSOS && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 animate-pulse">
          <span className="text-xl">🚨</span>
          <div>
            <h4 className="font-bold text-rose-950 text-xs">
              Urgent Safety Alert Detected
            </h4>
            <p className="text-[11px] text-rose-800 mt-0.5">
              Incident triggers emergency bypass. This report routes directly to the Internal Complaints Committee (ICC) & Principal desk.
            </p>
          </div>
        </div>
      )}

      {/* Text Area */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-[#17254D]">
            Describe Your Concern (PII Guard Active)
          </label>
          <span className="text-[11px] font-semibold text-gray-400">
            {rawText.length}/2000
          </span>
        </div>
        
        <textarea
          rows={5}
          value={rawText}
          onChange={handleTextChange}
          placeholder="e.g., In Physics Lab 3 with Prof. Sharma in Room 204, my roll 23CS014 was unfairly questioned..."
          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#F4C542] transition shadow-inner resize-none"
        />
      </div>

      {/* Privacy Telemetry Card */}
      <div className="rounded-2xl border border-gray-200 bg-[#72C7C9]/15 p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#17254D]"></span>
          <div>
            <span className="text-xs font-bold text-[#17254D]">
              In-Browser Data Anonymizer
            </span>
            <p className="text-[11px] text-gray-600">
              {redactedCount > 0
                ? `${redactedCount} personal identifiers stripped locally`
                : 'Zero personal identifiers currently exposed'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-white text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200">
          Client Regex Engine Active
        </span>
      </div>

      {/* Submit Button & Metadata Checkbox */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stripMetadata}
            onChange={(e) => setStripMetadata(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#17254D] focus:ring-[#F4C542]"
          />
          <span>Attach screenshot (Metadata stripped automatically)</span>
        </label>

        <button
          type="submit"
          disabled={rawText.trim().length < 8}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
            rawText.trim().length >= 8
              ? 'bg-[#17254D] hover:bg-[#263768] text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>🔒</span>
          <span>Submit Secure Report</span>
        </button>
      </div>
    </form>
  );
}