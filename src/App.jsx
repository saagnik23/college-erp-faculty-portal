import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import ReminderModal from './components/common/ReminderModal';
import FacultyLogin from './components/auth/FacultyLogin';

// Faculty Portal Components
import FacultyDashboard from './components/faculty/FacultyDashboard';
import FacultyGrades from './components/faculty/FacultyGrades';
import FacultyStudentsDirectory from './components/faculty/FacultyStudentsDirectory';
import StudentEventsGatePass from './components/student/StudentEventsGatePass';

// Data & Services
import {
  INITIAL_STUDENTS,
  INITIAL_EVENTS,
  INITIAL_GATE_PASSES,
  INITIAL_FACULTY
} from './data/mockData';
import { fetchStudents } from './services/studentService';
import { getVerifiedSession, clearSession } from './utils/authSecurity';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Master Data State
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [registeredEventIds, setRegisteredEventIds] = useState(['EVT-101', 'EVT-104']);
  const [gatePasses, setGatePasses] = useState(INITIAL_GATE_PASSES);
  const [reminderModalItem, setReminderModalItem] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restore encrypted faculty session if valid
  useEffect(() => {
    const verified = getVerifiedSession('faculty');
    if (verified) {
      setCurrentUser(verified);
    }
  }, []);

  // Fetch live students from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadStudents() {
      try {
        const res = await fetchStudents();
        if (isMounted && res && res.data && res.data.length > 0) {
          setStudentsList(res.data);
        }
      } catch (err) {
        console.warn('Faculty portal: failed to load students from database, keeping default state:', err);
      }
    }
    loadStudents();
    return () => { isMounted = false; };
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    clearSession('faculty');
    setCurrentUser(null);
  };

  const handleApplyGatePass = (newPass) => {
    setGatePasses((prev) => [newPass, ...prev]);
  };

  const handleUpdateGatePassStatus = (passId, newStatus) => {
    setGatePasses((prev) =>
      prev.map((gp) =>
        gp.id === passId
          ? {
              ...gp,
              status: newStatus,
              approvedBy: newStatus === 'Approved' ? (currentUser?.name || 'Faculty Advisor') : 'Rejected by Faculty',
              qrCode: `GP-${(gp.studentName || 'STUDENT').toUpperCase()}-${gp.studentRegNo}-${newStatus.toUpperCase()}`
            }
          : gp
      )
    );
  };

  // If not authenticated as faculty, show Faculty Authentication Gateway
  if (!currentUser) {
    return <FacultyLogin onLoginSuccess={(facultyUser) => setCurrentUser(facultyUser)} />;
  }

  return (
    <div className="min-h-screen bg-[#050c1e] text-white flex overflow-hidden font-sans antialiased">
      {/* 1. FACULTY SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#050c1e]">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {(activeTab === 'overview' || activeTab === 'attendance_timetable') && (
            <FacultyDashboard studentsList={studentsList} />
          )}

          {activeTab === 'grades_exams' && (
            <FacultyGrades studentsList={studentsList} />
          )}

          {activeTab === 'event_approvals' && (
            <StudentEventsGatePass
              student={null}
              events={events}
              registeredEventIds={registeredEventIds}
              onRegisterEvent={() => {}}
              gatePasses={gatePasses}
              onApplyGatePass={handleApplyGatePass}
              onOpenReminderModal={(item) => setReminderModalItem(item)}
              isFaculty={true}
              onUpdateGatePassStatus={handleUpdateGatePassStatus}
            />
          )}

          {activeTab === 'students_directory' && (
            <FacultyStudentsDirectory studentsList={studentsList} />
          )}
        </main>
      </div>

      {reminderModalItem && (
        <ReminderModal
          item={reminderModalItem}
          onClose={() => setReminderModalItem(null)}
        />
      )}
    </div>
  );
}
