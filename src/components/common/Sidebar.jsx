import React from 'react';
import {
  LayoutDashboard,
  Clock,
  GraduationCap,
  Sparkles,
  Users,
  ChevronRight
} from 'lucide-react';

export const FACULTY_NAV_TREE = [
  { id: 'overview', label: 'Overview & Profile', icon: LayoutDashboard },
  { id: 'attendance_timetable', label: 'Attendance Marker & Timetable', icon: Clock },
  { id: 'grades_exams', label: 'Grade Entry & Exams', icon: GraduationCap },
  { id: 'event_approvals', label: 'Event Approvals & Gate Pass', icon: Sparkles },
  { id: 'students_directory', label: 'Student Directory & Search', icon: Users },
];

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }) {
  return (
    <aside className="w-64 bg-[#0b132b] border-r border-white/10 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38bdf8] text-[#0b132b] font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            GEC
          </div>
          <div>
            <h1 className="text-xs font-black text-white tracking-wider uppercase">
              GEC AUTONOMOUS
            </h1>
            <span className="text-[9px] text-[#38bdf8] font-bold uppercase tracking-widest block">
              FACULTY PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Profile Summary Card */}
      <div className="p-3 mx-3 my-3 bg-[#111d3d] border border-white/10 rounded-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center text-xs font-black text-[#38bdf8]">
          {(currentUser?.name || 'FAC').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{currentUser?.name || "Dr. Faculty"}</p>
          <p className="text-[10px] text-gray-400 truncate">
            {currentUser?.dept || "Department of CSE"}
          </p>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
          FACULTY DESK
        </div>

        {FACULTY_NAV_TREE.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left ${
                isActive
                  ? 'bg-white text-blue-600 border-2 border-blue-600 font-bold shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 border-2 border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                <span className={isActive ? 'text-blue-600' : ''}>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 text-[10px] text-gray-400 text-center font-mono">
        Faculty Workspace • Autumn 2026
      </div>
    </aside>
  );
}
