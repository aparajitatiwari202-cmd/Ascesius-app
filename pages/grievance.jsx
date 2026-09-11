import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function GrievanceVault() {
  const [activeReports, setActiveReports] = useState([
    {
      id: 'GRV-1082',
      title: 'Hostel Washroom Geyser Electrical Hazard',
      submittedAt: 'Aug 31, 6:08 PM',
      severity: 'Critical',
      category: 'Hostel Maintenance',
      status: 'under_review',
      reviewTime: 'Sept 1, 9:15 AM',
      assignedTo: 'Hostel Warden & Maintenance Cell',
      targetDate: 'Sept 4, 2026',
      summary: 'Electrical shocks and exposed wire near [REDACTED ROOM]. Multiple batchmates affected.'
    },
    {
      id: 'GRV-0941',
      title: 'Physics Practical Attendance Discrepancy',
      submittedAt: 'Aug 24, 11:30 AM',
      severity: 'Standard',
      category: 'Academic Redressal',
      status: 'resolved',
      reviewTime: 'Aug 25, 2:00 PM',
      assignedTo: 'Proctorial Board Committee',
      targetDate: 'Aug 28, 2026',
      summary: 'Disputed lab manual sign-off for documented medical absences in [REDACTED ROOM].'
    }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState('GRV-1082');
  const selectedTicket = activeReports.find((r) => r.id === selectedTicketId) || activeReports[0];

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Confidential intake registrar initialized. All identifying details (roll numbers, names, rooms) are masked directly in browser memory before submission. What incident are you documenting?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState(0);

  const [caseFacts, setCaseFacts] = useState({
    category: 'Evaluating details...',
    location: 'Pending location input',
    department: 'Pending assignment',
    severity: 'Standard',
    routedTo: 'Triage Desk',
    targetResolution: '3-5 Working Days',
    redactedSnippet: ''
  });

  const [clarifications, setClarifications] = useState({
    'GRV-1082': [
      { sender: 'Hostel Warden', text: 'Maintenance has been notified. Has the breaker switch been disconnected?', time: 'Sept 1, 10:20 AM' },
      { sender: 'You (Anonymous)', text: 'Yes, floor representative shut it down yesterday.', time: 'Sept 1, 10:45 AM' }
    ]
  });
  const [replyText, setReplyText] = useState('');

  const chatEndRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isBotTyping]);

  const scrubPII = (text) => {
    return text
      .replace(/\b\d{2}[A-Za-z]{2,5}\d{2,4}\b/gi, '[REDACTED ROLL NO]')
      .replace(/\b(Prof\.|Dr\.|Mr\.|Ms\.)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g, '[REDACTED FACULTY]')
      .replace(/\bRoom\s*\d{1,3}\b/gi, '[REDACTED ROOM]');
  };

  const toggleVoiceDictation = () => {
    if (!isRecording) {
      setIsRecording(true);
      setInputText((prev) => (prev ? prev + ' ' : '') + 'In Room 204 during practical with Prof. Sharma...');
    } else {
      setIsRecording(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const raw = inputText;
    const sanitized = scrubPII(raw);
    const lower = raw.toLowerCase();

    const updated = [...messages, { sender: 'user', text: sanitized }];
    setMessages(updated);
    setInputText('');
    setIsRecording(false);
    setIsBotTyping(true);

    setTimeout(() => {
      let botReply = '';
      let newCategory = caseFacts.category;
      let newSeverity = caseFacts.severity;
      let newRoute = caseFacts.routedTo;
      let newLocation = caseFacts.location;
      let newTarget = caseFacts.targetResolution;

      const isPhysicalHazard = /(fan|fell|fall|ceiling|wire|shock|spark|fire|geyser|hazard|broke)/i.test(lower);
      const isEmergency = /(harassment|ragging|stalking|abuse|threat|fight)/i.test(lower);
      const isHostel = /(hostel|mess|food|washroom|warden)/i.test(lower);
      const isAcademic = /(lab|attendance|exam|practical|prof|marks|manual)/i.test(lower);

      if (isPhysicalHazard) {
        newCategory = 'Campus Infrastructure';
        newSeverity = 'Critical';
        newRoute = 'Estate Maintenance & Principal Desk';
        newTarget = 'Within 24 Hours';
        newLocation = sanitized.includes('[REDACTED ROOM]') ? 'Specific Campus Facility' : 'Documented Facility';
        botReply = "Urgent maintenance flag recorded. Was anyone injured, and which specific wing or building is affected?";
        setConversationStage(1);
      } else if (isEmergency) {
        newCategory = 'Safety & Urgent Conduct';
        newSeverity = 'Critical';
        newRoute = 'Internal Complaints Committee (ICC) & Principal';
        newTarget = 'Within 24 Hours';
        botReply = "This report has been flagged for direct priority delivery to the ICC and Principal. What approximate time and campus location did this occur?";
        setConversationStage(1);
      } else if (conversationStage === 0) {
        if (isHostel) {
          newCategory = 'Hostel & Sanitation';
          newRoute = 'Hostel Warden Office';
          newTarget = '2-3 Working Days';
          botReply = "Noted under hostel operations. Which hostel block or wing does this apply to?";
        } else if (isAcademic) {
          newCategory = 'Academic Redressal';
          newRoute = 'Proctorial Board & Academic Committee';
          newTarget = '3-5 Working Days';
          botReply = "Faculty and student identifiers have been masked. Did this affect an entire practical batch or an individual record?";
        } else {
          newCategory = 'General Student Redressal';
          newRoute = 'Proctorial Office';
          newTarget = '3-5 Working Days';
          botReply = "Details recorded. Please state the approximate date, time, and campus facility.";
        }
        setConversationStage(1);
      } else {
        botReply = "Information logged. The objective case record is compiled below. Click 'Dispatch Ticket' to submit to the ledger.";
        setConversationStage(2);
      }

      setCaseFacts({
        category: newCategory,
        severity: newSeverity,
        routedTo: newRoute,
        location: newLocation,
        department: newRoute,
        targetResolution: newTarget,
        redactedSnippet: sanitized
      });

      setIsBotTyping(false);
      setMessages([...updated, { sender: 'assistant', text: botReply }]);
    }, 450);
  };

  const handleFinalSubmit = () => {
    const randomIdNumber = Math.floor(2000 + Math.random() * 8000);
    const newId = `GRV-${randomIdNumber}`;
    const newReport = {
      id: newId,
      title: `${caseFacts.category} - ${caseFacts.location}`,
      submittedAt: 'Just now',
      severity: caseFacts.severity,
      category: caseFacts.category,
      status: 'submitted',
      reviewTime: 'Scheduled for review',
      assignedTo: caseFacts.routedTo,
      targetDate: caseFacts.targetResolution,
      summary: caseFacts.redactedSnippet || 'Objective facts recorded with personal identifiers scrubbed.'
    };

    setActiveReports([newReport, ...activeReports]);
    setSelectedTicketId(newId);
    setMessages([
      ...messages,
      {
        sender: 'assistant',
        text: `Ticket #${newId} dispatched. Monitor real-time status and staff clarifications in the right-hand audit ledger.`
      }
    ]);
  };

  const handleSendClarification = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const currentList = clarifications[selectedTicket.id] || [];
    setClarifications({
      ...clarifications,
      [selectedTicket.id]: [
        ...currentList,
        { sender: 'You (Anonymous)', text: replyText, time: 'Just now' }
      ]
    });
    setReplyText('');
  };

  const renderMessageContent = (text) => {
    const parts = text.split(/(\[REDACTED [^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[REDACTED')) {
        return (
          <span
            key={index}
            className="inline-block bg-[#FFB703]/20 text-[#023047] font-semibold border border-[#FB8500]/40 px-2 py-0.5 rounded-md text-xs font-mono shadow-xs animate-pulse"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-[#DCEAF3] text-[#023047] font-sans antialiased pb-16">
      <Navbar />

      {/* Page Header Band */}
      {/* Sub-Header Breadcrumb / Page Title */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#219EBC] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#219EBC]"></span>
              </span>
              <span className="text-[11px] tracking-wider uppercase text-[#219EBC] font-bold">
                Protected Student Intake
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#023047]">
              Zero-Retaliation Grievance Vault
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              File confidential incident reports without fear of academic or social reprisal. Identifiers are stripped on-device before submission.
            </p>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-2 text-xs bg-slate-100/80 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">Domain:</span>
            <span className="font-semibold text-[#023047]">@maitreyi.du.ac.in</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Guidelines & Protections */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Safety Protections</span>
                <svg className="w-4 h-4 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </h2>
              
              <div className="space-y-4 text-xs">
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#023047] mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC]"></span>
                    Pre-ingestion client redaction
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
                    Roll numbers, faculty prefixes, and room references are scrubbed in memory on your device before network transmission.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#023047] mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC]"></span>
                    Direct committee dispatch
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
                    Bypasses departmental desks and routes straight to statutory bodies (ICC, Hostel Warden, Proctorial Board).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#023047] mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC]"></span>
                    Permanent timestamp lock
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
                    Creates an immutable case record to prevent reports from being buried or deferred.
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Guidance Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-[11px] border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Submission Guidance</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </h3>
              <ul className="text-slate-600 space-y-2 list-disc pl-4 text-[11px] leading-relaxed">
                <li className="hover:text-[#023047] transition-colors">Note the approximate date, time, and facility wing.</li>
                <li className="hover:text-[#023047] transition-colors">State whether the issue affected multiple students.</li>
                <li className="hover:text-[#023047] transition-colors">Plain descriptions work best; formal legal terms are not needed.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Conversational Intake Terminal */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[600px] overflow-hidden">
              
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/75 backdrop-blur-sm flex justify-between items-center text-xs">
                <span className="font-bold text-[#023047] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#219EBC] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#219EBC]"></span>
                  </span>
                  Intake Registrar
                </span>
                <span className="text-[11px] font-medium text-[#219EBC] bg-[#219EBC]/10 px-2.5 py-0.5 rounded-full border border-[#219EBC]/20">
                  On-Device Privacy Active
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} transition-all duration-200`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#023047] text-white rounded-br-none hover:bg-[#033c59] transition-colors'
                          : 'bg-slate-100/80 text-slate-800 border border-slate-200/60 rounded-bl-none hover:bg-slate-100 transition-colors'
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.sender === 'user' ? 'Masked Draft' : 'Intake Assistant'}
                    </span>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-100/90 text-slate-500 px-3.5 py-2 rounded-2xl rounded-bl-none text-xs italic flex items-center gap-1.5 border border-slate-200/50 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC] animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC] animate-bounce [animation-delay:0.3s]"></span>
                      <span className="ml-1 text-[11px] font-medium text-slate-600">Reviewing facts...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Staged Case Summary Drawer */}
              {conversationStage >= 1 && (
                <div className="bg-slate-50/90 border-t border-slate-200/80 p-3.5 text-xs transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#023047] text-[11px] tracking-wide flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Staged Case Summary
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      caseFacts.severity === 'Critical' 
                        ? 'bg-[#FB8500]/15 text-[#FB8500] border border-[#FB8500]/30 animate-pulse' 
                        : 'bg-[#FFB703]/20 text-amber-900 border border-[#FFB703]/40'
                    }`}>
                      {caseFacts.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                    <div><span className="text-slate-400 font-medium">Category:</span> {caseFacts.category}</div>
                    <div><span className="text-slate-400 font-medium">Desk:</span> {caseFacts.routedTo}</div>
                  </div>
                </div>
              )}

              {/* Input Form & Controls */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isRecording
                        ? "Demo dictation inserted..."
                        : "Describe incident or answer questions..."
                    }
                    className="flex-1 border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#219EBC]/30 focus:border-[#219EBC] transition-all duration-200"
                  />

                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    title="Toggle demo voice dictation"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 ${
                      isRecording
                        ? 'bg-[#FB8500] text-white border-[#FB8500] shadow-sm animate-pulse'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="flex items-center gap-1.5 bg-[#023047] hover:bg-[#219EBC] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span>Send</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 leading-tight">
                  Automated masking shields roll numbers and faculty titles. Please avoid entering student nicknames manually.
                </div>

                {conversationStage >= 1 && (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="w-full mt-2.5 py-2.5 bg-[#FB8500] hover:bg-[#FB8500]/90 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Dispatch Anonymous Ticket to Ledger
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Column 3: Audit Ledger & Communications */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Active Ticket Selector */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tracked Case Files
                </span>
                <span className="text-xs font-bold text-[#219EBC] bg-[#219EBC]/10 px-2 py-0.5 rounded-full">
                  {activeReports.length} on record
                </span>
              </div>

              <div className="space-y-2.5">
                {activeReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedTicketId(report.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] ${
                      selectedTicketId === report.id
                        ? 'border-[#219EBC] bg-slate-50 shadow-xs ring-1 ring-[#219EBC]/30'
                        : 'border-slate-200/70 hover:border-slate-300 hover:shadow-xs bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-bold text-[#023047] truncate pr-2">{report.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono font-medium">#{report.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>{report.submittedAt}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        report.status === 'resolved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : report.status === 'under_review'
                          ? 'bg-[#FFB703]/20 text-amber-900 border border-[#FFB703]/40'
                          : 'bg-[#219EBC]/15 text-[#023047] border border-[#219EBC]/30'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Progress */}
              {selectedTicket && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-bold text-[#023047] flex items-center justify-between">
                    <span>Timeline: #{selectedTicket.id}</span>
                    <span className="text-[10px] font-normal text-slate-400">Immutable Audit Trail</span>
                  </div>

                  <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-1 text-xs">
                    <div className="relative group">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#219EBC] group-hover:scale-125 transition-transform"></div>
                      <div className="font-semibold text-slate-800">1. Received & Masked</div>
                      <div className="text-[10px] text-slate-400">{selectedTicket.submittedAt}</div>
                    </div>

                    <div className="relative group">
                      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-all ${
                        selectedTicket.status === 'under_review' 
                          ? 'bg-[#FFB703] ring-4 ring-[#FFB703]/30 animate-pulse' 
                          : selectedTicket.status === 'resolved'
                          ? 'bg-[#219EBC]'
                          : 'bg-slate-300'
                      }`}></div>
                      <div className="font-semibold text-slate-800">2. Committee Review</div>
                      <div className="text-[10px] text-slate-400">{selectedTicket.reviewTime}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-medium">Assigned: {selectedTicket.assignedTo}</div>
                    </div>

                    <div className="relative group">
                      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform ${
                        selectedTicket.status === 'resolved' ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}></div>
                      <div className="font-semibold text-slate-800">3. Action Resolved</div>
                      <div className="text-[10px] text-slate-400">Target: {selectedTicket.targetDate}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clarification Channel */}
            {selectedTicket && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>Follow-Up Inquiries</span>
                  <span className="font-mono font-normal text-slate-400">#{selectedTicket.id}</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(clarifications[selectedTicket.id] || []).length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-2 text-center">No inquiries dispatched yet.</div>
                  ) : (
                    (clarifications[selectedTicket.id] || []).map((c, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl text-xs transition-all duration-150 hover:-translate-y-0.5 ${
                          c.sender.includes('You')
                            ? 'bg-slate-50 text-slate-800 border border-slate-200/70 ml-3'
                            : 'bg-[#FFB703]/10 text-slate-800 border border-[#FFB703]/25 mr-3'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500 mb-1 font-semibold flex justify-between">
                          <span>{c.sender}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="leading-snug">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendClarification} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Send confidential response..."
                    className="flex-1 border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#219EBC]/30 focus:border-[#219EBC] transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-[#023047] hover:bg-[#219EBC] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}