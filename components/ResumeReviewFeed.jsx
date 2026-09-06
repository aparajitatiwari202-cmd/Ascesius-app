import React, { useState } from 'react';

export default function ResumeReviewFeed({ resumes }) {
  const defaultResumes = [
    {
      id: 1,
      candidateName: "Mourya R.",
      branch: "B.Sc CS (3rd Year)",
      targetRole: "Frontend Intern",
      pdfName: "Mourya_Frontend_Resume.pdf",
      votes: 14,
      critiques: [
        "Move your Next.js project to the top above education.",
        "Add measurable metrics under your SheCodes hackathon entry."
      ]
    }
  ];

  const displayList = resumes && resumes.length > 0 ? resumes : defaultResumes;

  return (
    <div className="space-y-4">
      {displayList.map((item) => (
        <ResumeCard key={item.id} data={item} />
      ))}
    </div>
  );
}

function ResumeCard({ data }) {
  const [votes, setVotes] = useState(data.votes);
  const [voted, setVoted] = useState(false);

  const vote = (delta) => {
    if (!voted) {
      setVotes(votes + delta);
      setVoted(true);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">{data.candidateName} • <span className="text-sm text-blue-800 font-normal">{data.branch}</span></h3>
          <p className="text-xs text-slate-500">Targeting: {data.targetRole}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
          <button onClick={() => vote(1)} className="hover:text-emerald-600 font-bold text-slate-500">▲</button>
          <span className="font-semibold text-slate-900">{votes}</span>
          <button onClick={() => vote(-1)} className="hover:text-rose-600 font-bold text-slate-500">▼</button>
        </div>
      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center my-3">
        <span className="text-sm text-slate-600">📄 {data.pdfName}</span>
        <button className="text-xs bg-blue-950 hover:bg-blue-900 px-3 py-1.5 rounded text-white font-medium">
          Preview PDF
        </button>
      </div>

      <div className="mt-3 space-y-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Peer Critiques:</h4>
        {data.critiques?.map((critique, idx) => (
          <p key={idx} className="text-xs bg-slate-50 p-2 rounded text-slate-600 border border-slate-100">
            💬 {critique}
          </p>
        ))}
      </div>
    </div>
  );
}