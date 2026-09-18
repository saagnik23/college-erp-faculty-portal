import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Bell,
  User,
  Check
} from 'lucide-react';

export default function StudentEventsGatePass({
  student,
  events,
  registeredEventIds = [],
  onRegisterEvent,
  gatePasses = [],
  onApplyGatePass,
  onOpenReminderModal,
  isFaculty = false,
  onUpdateGatePassStatus
}) {
  const [activeSubTab, setActiveSubTab] = useState('events'); // 'events' | 'gatepass'
  const [showMyRegisteredOnly, setShowMyRegisteredOnly] = useState(false);
  const [passFilter, setPassFilter] = useState('all'); // 'all' | 'Pending' | 'Approved' | 'Rejected'

  // New Gate Pass Form state
  const [showPassModal, setShowPassModal] = useState(false);
  const [passType, setPassType] = useState('Day Out-Pass');
  const [reason, setReason] = useState('');
  const [outTime, setOutTime] = useState('2026-09-17 04:00 PM');
  const [inTime, setInTime] = useState('2026-09-17 08:30 PM');

  // If faculty, show all student passes. If student, show their passes or all if they have none yet.
  const basePasses = isFaculty
    ? gatePasses
    : (gatePasses.filter((gp) => gp.studentRegNo === student?.regNo).length > 0
        ? gatePasses.filter((gp) => gp.studentRegNo === student?.regNo)
        : gatePasses);

  const displayPasses = basePasses.filter((gp) => {
    if (passFilter === 'all') return true;
    return gp.status?.toLowerCase() === passFilter.toLowerCase();
  });

  const displayEvents = showMyRegisteredOnly
    ? events.filter((e) => registeredEventIds.includes(e.id))
    : events;

  const handleSubmitPass = (e) => {
    e.preventDefault();
    const newPass = {
      id: `GP-${Date.now().toString().slice(-4)}`,
      studentRegNo: student?.regNo || '2501445001',
      studentName: student?.name || 'Student User',
      passType,
      reason,
      outTime,
      inTime,
      status: 'Pending',
      approvedBy: 'Warden Office',
      qrCode: `GP-${(student?.name || 'STUDENT').toUpperCase()}-${student?.regNo || '2501445001'}-PENDING`
    };
    onApplyGatePass(newPass);
    setShowPassModal(false);
    setReason('');
    alert("Out-pass request submitted to Hostel Warden!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ccff00] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isFaculty ? 'FACULTY APPROVAL DESK' : 'MODULE 1 & HOSTEL SECURITY'}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {isFaculty ? 'Events & Gate Pass Approvals' : 'Events & Digital Gate Pass Hub'}
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-[#111d3d] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'events'
                ? 'bg-[#ccff00] text-[#0b132b] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Campus Events ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gatepass')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'gatepass'
                ? 'bg-[#ccff00] text-[#0b132b] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Hostel Gate Passes ({basePasses.length})</span>
          </button>
        </div>
      </div>

      {/* EVENTS SUB-TAB */}
      {activeSubTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Browse Upcoming & Registered Events</h3>
            
            <button
              onClick={() => setShowMyRegisteredOnly(!showMyRegisteredOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showMyRegisteredOnly
                  ? 'bg-[#ccff00] text-[#0b132b]'
                  : 'bg-[#111d3d] text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {showMyRegisteredOnly ? 'Showing My Registered Events' : 'Show My Registered Events Only'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((evt) => {
              const isRegistered = registeredEventIds.includes(evt.id);
              return (
                <div key={evt.id} className="glass-card overflow-hidden flex flex-col justify-between border border-white/10 hover:border-[#ccff00]/40 transition-all">
                  <div className="relative h-44">
                    <img src={evt.banner} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="badge-neon">{evt.category}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{evt.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{evt.description}</p>
                    </div>

                    <div className="text-xs text-gray-300 space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center gap-2">
                      <button
                        onClick={() => onRegisterEvent(evt.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isRegistered
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 text-white hover:bg-[#ccff00] hover:text-[#0b132b]'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                          </>
                        ) : (
                          <>Register Now</>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenReminderModal({ title: evt.title, date: evt.date })}
                        className="p-2 rounded-xl bg-[#111d3d] hover:bg-white/10 text-gray-300 hover:text-[#ccff00]"
                        title="Set reminder"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GATE PASS SUB-TAB */}
      {activeSubTab === 'gatepass' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {isFaculty ? 'Student Digital Out-Pass Approvals' : 'Digital Out-Pass & Security QR Passes'}
              </h3>
              <p className="text-xs text-gray-400">
                {isFaculty
                  ? 'Review, approve, or reject student campus leave and out-pass requests.'
                  : 'Present approved QR Code to main gate security guard upon departure & arrival.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center bg-[#111d3d] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setPassFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    passFilter === 'all' ? 'bg-[#ccff00] text-[#0b132b]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({basePasses.length})
                </button>
                <button
                  onClick={() => setPassFilter('Pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    passFilter === 'Pending' ? 'bg-amber-400 text-[#0b132b]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pending ({basePasses.filter((p) => p.status === 'Pending').length})
                </button>
                <button
                  onClick={() => setPassFilter('Approved')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    passFilter === 'Approved' ? 'bg-emerald-400 text-[#0b132b]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Approved ({basePasses.filter((p) => p.status === 'Approved').length})
                </button>
              </div>

              <button
                onClick={() => setShowPassModal(true)}
                className="neon-btn text-xs px-4 py-2.5 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>{isFaculty ? 'New Pass' : 'Apply New Gate Pass'}</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {displayPasses.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
              <QrCode className="w-12 h-12 text-[#ccff00] mx-auto opacity-70" />
              <h4 className="text-base font-bold text-white">No Gate Passes in this Category</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                There are currently no gate passes matching your filter. You can apply for a new pass or select a different filter.
              </p>
              <button
                onClick={() => setShowPassModal(true)}
                className="neon-btn text-xs px-5 py-2 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Apply for Gate Pass
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayPasses.map((pass) => (
                <div key={pass.id} className="glass-card p-6 border border-white/15 relative overflow-hidden space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-xs font-bold text-[#ccff00] font-mono">{pass.id}</span>
                      <h4 className="text-sm font-black text-white mt-0.5">{pass.passType}</h4>
                      <div className="text-xs text-gray-300 font-medium flex items-center gap-1.5 mt-1">
                        <User className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span><strong>{pass.studentName || 'Student'}</strong> ({pass.studentRegNo})</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pass.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : pass.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {pass.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-300">
                    <p><strong>Reason:</strong> {pass.reason}</p>
                    <p><strong>Out Time:</strong> {pass.outTime}</p>
                    <p><strong>In Time:</strong> {pass.inTime}</p>
                    <p><strong>Approved/Reviewed By:</strong> {pass.approvedBy}</p>
                  </div>

                  {/* Digital QR Code Card */}
                  <div className="p-4 rounded-xl bg-white text-[#0b132b] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase">GATE SECURITY QR PASS</div>
                      <div className="text-xs font-mono font-black">{pass.qrCode}</div>
                      <div className="text-[9px] text-gray-500 mt-1">Scan at Security Post #1</div>
                    </div>
                    <div className="w-16 h-16 bg-[#0b132b] p-2 rounded-lg flex items-center justify-center text-white">
                      <QrCode className="w-12 h-12 text-[#ccff00]" />
                    </div>
                  </div>

                  {/* Faculty Actions (Approve / Reject) */}
                  {isFaculty && onUpdateGatePassStatus && (
                    <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                      {pass.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => onUpdateGatePassStatus(pass.id, 'Approved')}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve Pass
                          </button>
                          <button
                            onClick={() => onUpdateGatePassStatus(pass.id, 'Rejected')}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 italic flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />
                          <span>Pass action finalized: {pass.status}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Gate Pass Form Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 border border-[#ccff00]/40 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#ccff00]" /> Apply Hostel Gate Pass
            </h3>

            <form onSubmit={handleSubmitPass} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Pass Category</label>
                <select
                  value={passType}
                  onChange={(e) => setPassType(e.target.value)}
                  className="w-full bg-[#0b132b] text-white p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#ccff00]"
                >
                  <option value="Day Out-Pass">Day Out-Pass (Local City)</option>
                  <option value="Weekend Leave Pass">Weekend Leave Pass (Hometown)</option>
                  <option value="Emergency Out-Pass">Emergency Out-Pass</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Reason for Leaving Campus</label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specify destination and details..."
                  className="w-full bg-[#0b132b] text-white p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#ccff00]"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="w-full bg-[#0b132b] text-white p-2.5 rounded-xl border border-white/15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Return Time</label>
                  <input
                    type="text"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full bg-[#0b132b] text-white p-2.5 rounded-xl border border-white/15"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="neon-btn text-xs px-5 py-2.5">
                  Submit Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
