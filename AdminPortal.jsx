import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCharts from '../components/AttendanceCharts';
import FacultyKPIRanking from '../components/FacultyKPIRanking';
import FeedbackAnalysis from '../components/FeedbackAnalysis';
import DataUploadModal from '../components/DataUploadModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import FacultyModal from '../components/FacultyModal';
import StudentModal from '../components/StudentModal';
import FeedbackModal from '../components/FeedbackModal';
import { 
  Users, 
  UserCheck, 
  UserPlus,
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3,
  Clock, 
  BookOpen, 
  BarChart3, 
  Sliders, 
  ShieldCheck, 
  AlertCircle,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Percent,
  KeyRound,
  ShieldAlert,
  ArrowRightLeft,
  Plus
} from 'lucide-react';

export default function AdminPortal({ onOpenPowerBi }) {
  const { 
    currentUser, 
    usersList,
    createNewAdmin,
    replaceAdminAccount,
    revokeAdminRole,
    promoteToAdmin
  } = useAuth();

  const { 
    attendanceRecords, 
    facultyList, 
    studentsList, 
    feedbacks, 
    kpiWeights, 
    updateKpiWeights,
    // Attendance
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    bulkAddAttendanceRecords,
    // Faculty
    addFaculty,
    updateFaculty,
    deleteFaculty,
    // Students
    addStudent,
    updateStudent,
    approveStudent,
    rejectStudent,
    deleteStudent,
    // Feedbacks
    submitFeedback,
    updateFeedback,
    deleteFeedback 
  } = useData();

  // Navigation tabs within Admin Portal
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'faculty' | 'students' | 'feedbacks' | 'weights' | 'security'

  // Modal states
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceToEdit, setAttendanceToEdit] = useState(null);

  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState(null);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackToEdit, setFeedbackToEdit] = useState(null);

  // Generic Delete Confirmation Modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: () => {}
  });

  // KPI weights local state
  const [localWeights, setLocalWeights] = useState({
    teaching: Math.round(kpiWeights.teaching * 100),
    research: Math.round(kpiWeights.research * 100),
    feedback: Math.round(kpiWeights.feedback * 100),
    development: Math.round(kpiWeights.development * 100),
    contribution: Math.round(kpiWeights.contribution * 100),
  });
  const [weightsSaved, setWeightsSaved] = useState(false);

  // Admin Account Change State
  const [newAdminForm, setNewAdminForm] = useState({
    email: '',
    password: '',
    displayName: '',
    revokeCurrentAdmin: false
  });
  const [adminActionStatus, setAdminActionStatus] = useState(null);
  const [adminActionError, setAdminActionError] = useState(null);
  const [isAdminProcessing, setIsAdminProcessing] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Stat metrics
  const totalClasses = attendanceRecords.length;
  const totalStudentsEnrolled = studentsList.length;
  const pendingRegistrations = studentsList.filter(s => s.status === 'Pending').length;
  
  const totalPresent = attendanceRecords.reduce((acc, r) => acc + (Number(r.present) || 0), 0);
  const totalHeadcount = attendanceRecords.reduce((acc, r) => acc + (Number(r.totalStudents) || 0), 0);
  const overallAttendancePct = totalHeadcount > 0 ? Math.round((totalPresent / totalHeadcount) * 100) : 0;
  
  const totalFeedbackCount = feedbacks.length;
  const avgFacultyRating = totalFeedbackCount > 0 
    ? (feedbacks.reduce((a, c) => a + Number(c.rating || 0), 0) / totalFeedbackCount).toFixed(1)
    : '4.8';

  // --- ATTENDANCE HANDLERS ---
  const handleEditAttendance = (record) => {
    setAttendanceToEdit(record);
    setIsAttendanceModalOpen(true);
  };

  const handleDeleteAttendancePrompt = (id) => {
    const item = attendanceRecords.find(r => r.id === id);
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Attendance Record',
      message: 'Are you sure you want to delete this class attendance record?',
      itemName: `${item?.subject || id} (${item?.period || ''})`,
      onConfirm: async () => {
        try {
          await deleteAttendanceRecord(id);
          showToast(`Attendance record for ${item?.subject || 'class'} deleted successfully.`, 'success');
        } catch (err) {
          showToast('Failed to delete attendance record: ' + err.message, 'error');
        }
      }
    });
  };

  // --- FACULTY HANDLERS ---
  const handleEditFaculty = (fac) => {
    setFacultyToEdit(fac);
    setIsFacultyModalOpen(true);
  };

  const handleDeleteFacultyPrompt = (id) => {
    const item = facultyList.find(f => f.id === id);
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Faculty Member',
      message: 'Are you sure you want to permanently delete this faculty profile and associated evaluation records?',
      itemName: `${item?.name || id} - ${item?.designation || ''}`,
      onConfirm: async () => {
        try {
          await deleteFaculty(id);
          showToast(`Faculty profile "${item?.name}" removed permanently.`, 'success');
        } catch (err) {
          showToast('Failed to delete faculty: ' + err.message, 'error');
        }
      }
    });
  };

  // --- STUDENT HANDLERS ---
  const handleEditStudent = (stu) => {
    setStudentToEdit(stu);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudentPrompt = (id) => {
    const item = studentsList.find(s => s.id === id);
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Student Record',
      message: 'Are you sure you want to remove this student account and registrations?',
      itemName: `${item?.name || id} (${item?.rollNumber || ''})`,
      onConfirm: async () => {
        try {
          await deleteStudent(id);
          showToast(`Student record for ${item?.name} removed.`, 'success');
        } catch (err) {
          showToast('Failed to delete student: ' + err.message, 'error');
        }
      }
    });
  };

  // --- FEEDBACK HANDLERS ---
  const handleEditFeedback = (fdb) => {
    setFeedbackToEdit(fdb);
    setIsFeedbackModalOpen(true);
  };

  const handleDeleteFeedbackPrompt = (id) => {
    const item = feedbacks.find(f => f.id === id);
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Feedback Evaluation',
      message: 'Are you sure you want to delete this student appraisal entry?',
      itemName: `Evaluation for ${item?.facultyName || id}`,
      onConfirm: async () => {
        try {
          await deleteFeedback(id);
          showToast(`Feedback record removed successfully.`, 'success');
        } catch (err) {
          showToast('Failed to delete feedback: ' + err.message, 'error');
        }
      }
    });
  };

  // --- KPI WEIGHTS HANDLER ---
  const handleSaveWeights = (e) => {
    e.preventDefault();
    const sum = Number(localWeights.teaching) + 
                Number(localWeights.research) + 
                Number(localWeights.feedback) + 
                Number(localWeights.development) + 
                Number(localWeights.contribution);
    
    if (sum !== 100) {
      alert(`The sum of weights must equal 100%. Currently it is ${sum}%. Please adjust.`);
      return;
    }

    updateKpiWeights({
      teaching: localWeights.teaching / 100,
      research: localWeights.research / 100,
      feedback: localWeights.feedback / 100,
      development: localWeights.development / 100,
      contribution: localWeights.contribution / 100,
    });
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2000);
  };

  // --- ADMIN ACCOUNT CREATION / TRANSFER HANDLER ---
  const handleAdminAccountSubmit = async (e) => {
    e.preventDefault();
    setAdminActionError(null);
    setAdminActionStatus(null);
    setIsAdminProcessing(true);

    try {
      if (newAdminForm.revokeCurrentAdmin) {
        // Transfer and revoke
        const res = await replaceAdminAccount({
          newEmail: newAdminForm.email,
          newPassword: newAdminForm.password,
          newDisplayName: newAdminForm.displayName,
          revokeCurrentAdmin: true
        });
        setAdminActionStatus(`Admin ownership successfully transferred to ${newAdminForm.email}. Old admin access revoked.`);
      } else {
        // Add new co-admin
        await createNewAdmin({
          email: newAdminForm.email,
          password: newAdminForm.password,
          displayName: newAdminForm.displayName
        });
        setAdminActionStatus(`New administrator account ${newAdminForm.email} created successfully.`);
      }

      setNewAdminForm({
        email: '',
        password: '',
        displayName: '',
        revokeCurrentAdmin: false
      });
    } catch (err) {
      setAdminActionError(err.message || 'Failed to update admin account.');
    } finally {
      setIsAdminProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Administrator Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional KPI & Daily Attendance Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Complete administrative authority to manage faculty evaluation models, student registrations, daily attendance tracking, SMS alerts, and Power BI reporting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => { setAttendanceToEdit(null); setIsAttendanceModalOpen(true); }}
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25 transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Upload / Add Data</span>
            </button>

            <button
              onClick={() => { setFacultyToEdit(null); setIsFacultyModalOpen(true); }}
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>

            <button
              onClick={onOpenPowerBi}
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Power BI Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Attendance Rate"
          value={`${overallAttendancePct}%`}
          subtitle="Target threshold: 85%"
          trend="+3.2% vs last week"
          trendPositive={true}
          icon={Percent}
          color="amber"
        />
        <StatCard
          title="Total Faculty Monitored"
          value={facultyList.length}
          subtitle="Across 6 engineering departments"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Student Registrations"
          value={totalStudentsEnrolled}
          subtitle={pendingRegistrations > 0 ? `${pendingRegistrations} pending approval` : 'All registrations verified'}
          trend={pendingRegistrations > 0 ? `${pendingRegistrations} Pending` : 'Verified'}
          trendPositive={pendingRegistrations === 0}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Student Feedbacks"
          value={totalFeedbackCount}
          subtitle={`Institution Average: ${avgFacultyRating} / 5.0`}
          trend={`${avgFacultyRating} ★`}
          trendPositive={true}
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold select-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Visuals</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Attendance Records ({attendanceRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'faculty'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Faculty Management ({facultyList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`relative px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student Registrations</span>
          {pendingRegistrations > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
              {pendingRegistrations}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'feedbacks'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Feedback Analysis ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('weights')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'weights'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>KPI Weights Config</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Admin Security & Account</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <AttendanceCharts records={attendanceRecords} />
          <FacultyKPIRanking 
            facultyList={facultyList} 
            feedbacks={feedbacks} 
            kpiWeights={kpiWeights} 
          />
          <AttendanceTable
            records={attendanceRecords}
            isAdmin={true}
            onAddClick={() => { setAttendanceToEdit(null); setIsAttendanceModalOpen(true); }}
            onEditRecord={handleEditAttendance}
            onDeleteRecord={handleDeleteAttendancePrompt}
          />
        </div>
      )}

      {/* Tab 2: Attendance Records Management */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceTable
            records={attendanceRecords}
            isAdmin={true}
            onAddClick={() => { setAttendanceToEdit(null); setIsAttendanceModalOpen(true); }}
            onEditRecord={handleEditAttendance}
            onDeleteRecord={handleDeleteAttendancePrompt}
          />
          <AttendanceCharts records={attendanceRecords} />
        </div>
      )}

      {/* Tab 3: Faculty Management (Add, Edit, Delete Faculty) */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Faculty Roster & Performance Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Add, update, and manage teaching load, research publications, and departmental parameters
                </p>
              </div>

              <button
                onClick={() => { setFacultyToEdit(null); setIsFacultyModalOpen(true); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            {/* Faculty List with Edit / Delete actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyList.map(fac => (
                <div 
                  key={fac.id}
                  className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all powerbi-card"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <img
                        src={fac.avatar}
                        alt={fac.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{fac.name}</h4>
                        <p className="text-[11px] text-amber-400 truncate">{fac.designation}</p>
                        <p className="text-[10px] text-slate-400 truncate">{fac.department}</p>
                        <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {fac.experience || `${fac.experienceYears || 10} Yrs Exp`}
                        </span>
                      </div>
                    </div>

                    {fac.assignedSubjects && fac.assignedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {fac.assignedSubjects.slice(0, 3).map((sub, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                            {typeof sub === 'string' ? sub : (sub?.name || sub?.code || 'Course')}
                          </span>
                        ))}
                        {fac.assignedSubjects.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-500">
                            +{fac.assignedSubjects.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-900 grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-slate-900/90 p-1.5 rounded-lg">
                        <span className="block text-slate-400">Pubs</span>
                        <span className="font-bold text-white">{fac.research?.publications || 0}</span>
                      </div>
                      <div className="bg-slate-900/90 p-1.5 rounded-lg">
                        <span className="block text-slate-400">Patents</span>
                        <span className="font-bold text-white">{fac.research?.patents || 0}</span>
                      </div>
                      <div className="bg-slate-900/90 p-1.5 rounded-lg">
                        <span className="block text-slate-400">Att %</span>
                        <span className="font-bold text-emerald-400">{fac.teaching?.attendancePercentage || 90}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">{fac.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditFaculty(fac)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFacultyPrompt(fac.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FacultyKPIRanking
            facultyList={facultyList}
            feedbacks={feedbacks}
            kpiWeights={kpiWeights}
          />
        </div>
      )}

      {/* Tab 4: Student Registrations Management (Add, Edit, Approve, Reject, Delete) */}
      {activeTab === 'students' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Student Registration Approvals & Roster
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {studentsList.length} registered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                New self-registered students appear here with "Pending" status for admin verification
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setStudentToEdit(null); setIsStudentModalOpen(true); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>

              {pendingRegistrations > 0 && (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  {pendingRegistrations} Pending
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Program / Branch</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Registration Date</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {studentsList.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.name)}&background=2563EB&color=fff`}
                          alt={stu.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white">{stu.name}</div>
                          <div className="text-[11px] text-slate-400">{stu.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {stu.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{stu.program}</div>
                      <div className="text-[11px] text-slate-400">{stu.branch}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {stu.semester}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {stu.registrationDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        stu.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : stu.status === 'Rejected'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                      }`}>
                        {stu.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      {stu.status !== 'Approved' && (
                        <button
                          onClick={async () => {
                            await approveStudent(stu.id);
                            showToast(`Student ${stu.name} has been approved.`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors inline-flex items-center gap-1"
                          title="Approve Student Account"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      {stu.status !== 'Rejected' && (
                        <button
                          onClick={async () => {
                            await rejectStudent(stu.id);
                            showToast(`Student ${stu.name} registration rejected.`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors inline-flex items-center gap-1"
                          title="Reject Student Registration"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleEditStudent(stu)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Student"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudentPrompt(stu.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Feedback Analysis with Add / Edit / Delete */}
      {activeTab === 'feedbacks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setFeedbackToEdit(null); setIsFeedbackModalOpen(true); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Evaluation Entry</span>
            </button>
          </div>

          <FeedbackAnalysis
            feedbacks={feedbacks}
            facultyList={facultyList}
            isAdmin={true}
            onEditFeedback={handleEditFeedback}
            onDeleteFeedback={handleDeleteFeedbackPrompt}
          />
        </div>
      )}

      {/* Tab 6: KPI Weights Configuration */}
      {activeTab === 'weights' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              Configure Institutional KPI Weights
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust the weight contribution percentage for each performance pillar. Total sum must equal 100%.
            </p>
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">1. Teaching Performance Score:</span>
                <span className="text-amber-400 font-mono">{localWeights.teaching}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.teaching}
                onChange={(e) => setLocalWeights({ ...localWeights, teaching: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
              <p className="text-[11px] text-slate-500">Includes class completion %, student pass %, and attendance %</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">2. Research & Academic Output:</span>
                <span className="text-blue-400 font-mono">{localWeights.research}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.research}
                onChange={(e) => setLocalWeights({ ...localWeights, research: Number(e.target.value) })}
                className="w-full accent-blue-400"
              />
              <p className="text-[11px] text-slate-500">Publications, conferences, patents, research projects, books</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">3. Student Feedback Evaluations:</span>
                <span className="text-emerald-400 font-mono">{localWeights.feedback}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.feedback}
                onChange={(e) => setLocalWeights({ ...localWeights, feedback: Number(e.target.value) })}
                className="w-full accent-emerald-400"
              />
              <p className="text-[11px] text-slate-500">Student ratings across clarity, punctuality, and doubt resolution</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">4. Professional Development:</span>
                <span className="text-purple-400 font-mono">{localWeights.development}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.development}
                onChange={(e) => setLocalWeights({ ...localWeights, development: Number(e.target.value) })}
                className="w-full accent-purple-400"
              />
              <p className="text-[11px] text-slate-500">Certifications, professional workshops, FDPs attended</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">5. Departmental Contributions:</span>
                <span className="text-pink-400 font-mono">{localWeights.contribution}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.contribution}
                onChange={(e) => setLocalWeights({ ...localWeights, contribution: Number(e.target.value) })}
                className="w-full accent-pink-400"
              />
              <p className="text-[11px] text-slate-500">Committee assignments, event organization, student mentoring</p>
            </div>

            {/* Sum indicator */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Total Sum:</span>
              <span className={`font-mono font-extrabold text-sm ${
                (localWeights.teaching + localWeights.research + localWeights.feedback + localWeights.development + localWeights.contribution) === 100
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}>
                {localWeights.teaching + localWeights.research + localWeights.feedback + localWeights.development + localWeights.contribution}%
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 transition-all"
              >
                {weightsSaved ? 'Saved Successfully!' : 'Apply Weights Configuration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 7: Admin Account Security & Transfer Management */}
      {activeTab === 'security' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Current Admin Account Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400/10 rounded-xl text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Active Administrator Identity</h3>
                  <p className="text-xs text-slate-400">Current authenticated account with administrative permissions</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Email Address:</span>
                <p className="text-white font-mono font-semibold">{currentUser?.email}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">User Identification:</span>
                <p className="text-white font-mono text-[11px] truncate">{currentUser?.uid || 'admin-local'}</p>
              </div>
            </div>
          </div>

          {/* Add / Replace Admin Form */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                Create New Admin or Replace Current Admin
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enables you to register a replacement administrator through Firebase Authentication and optionally revoke access for the old admin.
              </p>
            </div>

            {adminActionStatus && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{adminActionStatus}</span>
              </div>
            )}

            {adminActionError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminActionError}</span>
              </div>
            )}

            <form onSubmit={handleAdminAccountSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">New Admin Email</label>
                  <input
                    type="email"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="newadmin@institution.edu"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Administrator Name</label>
                  <input
                    type="text"
                    value={newAdminForm.displayName}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, displayName: e.target.value })}
                    placeholder="e.g. Chief Academic Officer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Secure Password</label>
                <input
                  type="password"
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="Min 6 characters (e.g. AdminPass@2026)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAdminForm.revokeCurrentAdmin}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, revokeCurrentAdmin: e.target.checked })}
                    className="accent-amber-400 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white block">
                      Transfer Full Ownership & Revoke Current Admin Access
                    </span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Check this box to replace the current admin entirely. The new admin will be granted the primary administrator role, and the old admin account will be revoked.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAdminProcessing}
                  className="px-6 py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{isAdminProcessing ? 'Processing...' : (newAdminForm.revokeCurrentAdmin ? 'Replace Admin & Transfer' : 'Create New Co-Admin')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* All Registered User Roles Directory */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight">System User Directory & Roles</h3>
              <p className="text-xs text-slate-400">Promote or revoke administrator status across accounts</p>
            </div>

            <div className="divide-y divide-slate-800">
              {usersList.map((u, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || u.email)}&background=F2C811&color=000`}
                      alt={u.email}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{u.displayName || u.name}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      u.role === 'admin'
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                        : u.role === 'faculty'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}>
                      {u.role?.toUpperCase()}
                    </span>

                    {u.role === 'admin' ? (
                      <button
                        onClick={() => {
                          if (confirm(`Revoke administrator privileges for ${u.email}?`)) {
                            revokeAdminRole(u.email);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                      >
                        Revoke Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(`Promote ${u.email} to Administrator?`)) {
                            promoteToAdmin(u.email);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 transition-colors"
                      >
                        Promote to Admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- ALL CRUD MODALS --- */}

      {/* 1. Attendance Data Upload / Edit Modal */}
      <DataUploadModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onAddRecord={async (record) => {
          await addAttendanceRecord(record);
          showToast(`Attendance record for ${record.subject} added successfully.`);
        }}
        onUpdateRecord={async (record) => {
          await updateAttendanceRecord(record);
          showToast(`Attendance record for ${record.subject} updated.`);
        }}
        onBulkAdd={async (records) => {
          await bulkAddAttendanceRecords(records);
          showToast(`Successfully imported ${records.length} attendance records.`);
        }}
        recordToEdit={attendanceToEdit}
        facultyList={facultyList}
      />

      {/* 2. Faculty Add / Edit Modal */}
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSave={async (data) => {
          if (facultyToEdit) {
            await updateFaculty(data);
            showToast(`Faculty "${data.name}" profile and KPI metrics updated.`);
          } else {
            await addFaculty(data);
            showToast(`Faculty member "${data.name}" registered successfully.`);
          }
        }}
        facultyToEdit={facultyToEdit}
      />

      {/* 3. Student Add / Edit Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={async (data) => {
          if (studentToEdit) {
            await updateStudent(data);
            showToast(`Student record for "${data.name}" updated.`);
          } else {
            await addStudent(data);
            showToast(`Student "${data.name}" added successfully.`);
          }
        }}
        studentToEdit={studentToEdit}
      />

      {/* 4. Feedback Add / Edit Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSave={async (data) => {
          if (feedbackToEdit) {
            await updateFeedback(data);
            showToast(`Feedback appraisal updated successfully.`);
          } else {
            await submitFeedback(data);
            showToast(`Feedback appraisal submitted successfully.`);
          }
        }}
        feedbackToEdit={feedbackToEdit}
        facultyList={facultyList}
      />

      {/* 5. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        itemName={deleteModalState.itemName}
        onConfirm={deleteModalState.onConfirm}
        onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
      />

      {/* 6. Floating Status / Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-800 shadow-rose-900/40'
              : toast.type === 'info'
              ? 'bg-blue-950/95 text-blue-200 border-blue-800 shadow-blue-900/40'
              : 'bg-emerald-950/95 text-emerald-200 border-emerald-800 shadow-emerald-900/40'
          }`}>
            {toast.type === 'error' ? (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
