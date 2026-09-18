import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, LogIn, Lock, Mail, Sparkles } from 'lucide-react';
import { INITIAL_FACULTY } from '../../data/mockData';
import { hashSecret, saveEncryptedSession } from '../../utils/authSecurity';

export default function FacultyLogin({ onLoginSuccess }) {
  const [selectedFacultyId, setSelectedFacultyId] = useState(INITIAL_FACULTY[0]?.id || '');
  const [emailInput, setEmailInput] = useState(INITIAL_FACULTY[0]?.email || 'ak.nayak@bput.ac.in');
  const [pinInput, setPinInput] = useState('1982-08-15');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelectFaculty = (f) => {
    setSelectedFacultyId(f.id);
    setEmailInput(f.email);
    setPinInput(f.dob || '1982-08-15');
    setErrorMsg('');
  };

  const handleFacultyAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    try {
      let faculty = INITIAL_FACULTY.find(
        (f) => f.email?.toLowerCase() === emailInput.trim().toLowerCase() || f.id === selectedFacultyId
      );

      if (!faculty) {
        faculty = {
          id: `FAC-${Date.now().toString().slice(-3)}`,
          name: emailInput.split('@')[0].replace('.', ' ').toUpperCase(),
          email: emailInput,
          dept: 'Computer Science & Engineering',
          designation: 'Assistant Professor',
          courses: ['Data Structures & Algorithms', 'Database Systems']
        };
      }

      // Hash PIN for security audit
      await hashSecret(pinInput);

      // Save encrypted session
      saveEncryptedSession('faculty', faculty);
      onLoginSuccess(faculty);
    } catch (err) {
      setErrorMsg('Authentication error. Please check your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050c1e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-[#38bdf8]/30 shadow-[0_0_35px_rgba(56,189,248,0.15)] relative space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>GEC AUTONOMOUS COLLEGE BHUBANESWAR</span>
          </div>
          <h1 className="text-2xl font-black text-white">Faculty Portal Access</h1>
          <p className="text-xs text-gray-400">
            Authorized Faculty & Department Educators Authentication Gate
          </p>
        </div>

        {/* Security Shield Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#111d3d] border border-white/10 text-xs text-gray-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Role-restricted access. Student and public access strictly prohibited.</span>
        </div>

        {/* Preset Faculty Profiles */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Select Faculty Member
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INITIAL_FACULTY.map((f) => {
              const isSelected = f.id === selectedFacultyId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFaculty(f)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    isSelected
                      ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-white shadow-[0_0_12px_rgba(56,189,248,0.25)] font-bold'
                      : 'bg-[#111d3d] border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold truncate">{f.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{f.designation}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFacultyAuth} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-bold mb-1">Official University Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-[#0b132b] text-white rounded-xl pl-9 pr-4 py-2.5 border border-white/15 focus:outline-none focus:border-[#38bdf8]"
                placeholder="faculty@bput.ac.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Faculty Security PIN / Passcode</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                required
                className="w-full bg-[#0b132b] text-white rounded-xl pl-9 pr-4 py-2.5 border border-white/15 focus:outline-none focus:border-[#38bdf8]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#38bdf8] to-blue-600 text-[#0b132b] font-black text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{isVerifying ? 'Authenticating...' : 'Enter Faculty Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
