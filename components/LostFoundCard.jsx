import React, { useState } from 'react';

export default function LostFoundCard({ item }) {
  const [claimed, setClaimed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = Boolean(item?.image) && !imageFailed;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-sm">
      <div className="h-36 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-4xl mb-4">
        {hasImage ? (
          <img
            src={item.image}
            alt={item?.title || 'Lost item'}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>{item?.icon || '🔍'}</span>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
          🤖 {item?.matchConfidence || '94%'} Vector Match
        </span>
        <span className="text-xs text-slate-400">{item?.timestamp || '2 hrs ago'}</span>
      </div>

      <h3 className="font-semibold text-base text-slate-900">{item?.title || 'Casio fx-991EX Calculator'}</h3>
      <p className="text-xs text-slate-500 mt-1">
        📍 Found in: <span className="text-slate-700">{item?.location || 'Physics Lab 3'}</span>
      </p>

      <button 
        disabled={claimed}
        onClick={() => setModalOpen(true)}
        className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition ${
          claimed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-blue-900 text-white'
        }`}
      >
        {claimed ? 'Claim Verification Pending' : 'Claim Item'}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-xl max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-slate-900">Secure Drop-Point Hand-off</h3>
            <p className="text-sm text-slate-600 mt-2">
              To protect student contact details, items are safely held at official campus desks:
            </p>
            <div className="bg-slate-50 p-3 rounded my-3 border border-slate-200 text-sm text-slate-700">
              🏷️ <strong>Deposit Point:</strong> CS Dept Lab Attendant Desk (Room 204)
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => { setClaimed(true); setModalOpen(false); }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded font-medium text-sm text-white"
              >
                Confirm Claim Ticket
              </button>
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}