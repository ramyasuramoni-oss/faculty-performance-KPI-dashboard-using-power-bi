import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  GraduationCap, 
  BookOpen, 
  Star, 
  MessageSquare, 
  Clock, 
  Search, 
  CheckCircle, 
  Sparkles, 
  Send, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function StudentPortal() {
  const { currentUser } = useAuth();
  const { facultyList, attendanceRecords, feedbacks, submitFeedback } = useData();

  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' | 'feedback' | 'schedule' | 'attendance'
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Feedback form state
  const [selectedFacultyId, setSelectedFacultyId] = useState(facultyList[0]?.id || '');
  const [subjectName, setSubjectName] = useState(facultyList[0]?.assignedSubjects?.[0]?.name || '');
  const [overallRating, setOverallRating] = useState(5);
  const [clarityRating, setClarityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [knowledgeRating, setKnowledgeRating] = useState(5);
  const [doubtRating, setDoubtRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Departments list for filter
  const departments = ['All', ...new Set(facultyList.map(f => f.department).filter(Boolean))];

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return facultyList.filter(f => {
      const matchesSearch = !searchTerm || 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.assignedSubjects?.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept = deptFilter === 'All' || f.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchTerm, deptFilter]);

  // Selected faculty object for feedback form
  const currentSelectedFaculty = useMemo(() => {
    return facultyList.find(f => f.id === selectedFacultyId) || facultyList[0];
  }, [facultyList, selectedFacultyId]);

  // Student's branch attendance records (permitted info)
  const studentBranchAttendance = useMemo(() => {
    const branch = currentUser?.branch || 'Computer Science & Engineering';
    return attendanceRecords.filter(r => 
      r.branch.toLowerCase().includes(branch.toLowerCase().slice(0, 10))
    );
  }, [attendanceRecords, currentUser]);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackComments.trim()) {
      alert('Please provide a brief constructive feedback comment.');
      return;
    }

    submitFeedback({
      facultyId: currentSelectedFaculty.id,
      facultyName: currentSelectedFaculty.name,
      subject: subjectName || currentSelectedFaculty.assignedSubjects?.[0]?.name || 'General Course',
      studentRoll: currentUser?.rollNumber || 'STU-STUDENT',
      studentName: currentUser?.displayName || 'Student',
      rating: overallRating,
      clarity: clarityRating,
      punctuality: punctualityRating,
      knowledge: knowledgeRating,
      doubtResolution: doubtRating,
      comments: feedbackComments.trim()
    });

    setSubmissionSuccess(true);
    setFeedbackComments('');
    setTimeout(() => {
      setSubmissionSuccess(false);
      setActiveTab('faculty');
    }, 2200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Student Profile Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'Student')}&background=2563EB&color=fff`}
              alt="Student Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentUser?.rollNumber || '21CS045'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Registered Student
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentUser?.displayName || 'Student Portal'}
              </h1>
              <p className="text-xs text-slate-300">
                {currentUser?.program || 'B.Tech'} • {currentUser?.branch || 'Computer Science & Engineering'} • {currentUser?.semester || 'Semester 5'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('feedback')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25 transition-all flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>Submit Faculty Feedback</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold select-none">
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'faculty'
              ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Faculty Directory ({facultyList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Submit Course Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Class Attendance Schedule</span>
        </button>
      </div>

      {/* Tab 1: Faculty Directory */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty name, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((fac) => (
              <div 
                key={fac.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-blue-500/40 transition-all powerbi-card flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={fac.avatar}
                      alt={fac.name}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-800 shadow"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{fac.name}</h3>
                      <p className="text-xs text-amber-400 font-medium">{fac.designation}</p>
                      <p className="text-[11px] text-slate-400">{fac.department}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{fac.qualification}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {fac.experience || `${fac.experienceYears || 10} Years Experience`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      Courses Instructed
                    </div>
                    <div className="space-y-1">
                      {fac.assignedSubjects?.map((sub, sIdx) => (
                        <div key={sIdx} className="text-xs p-1.5 rounded-lg bg-slate-950 flex items-center justify-between text-slate-300">
                          <span className="font-medium truncate max-w-[170px]">{sub.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{sub.semester}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">{fac.email}</span>
                  <button
                    onClick={() => {
                      setSelectedFacultyId(fac.id);
                      setSubjectName(fac.assignedSubjects?.[0]?.name || '');
                      setActiveTab('feedback');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30 transition-colors flex items-center gap-1.5"
                  >
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Rate Faculty</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 2: Submit Faculty Feedback Form */}
      {activeTab === 'feedback' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Submit Faculty Performance Evaluation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your confidential student evaluation directly informs institutional KPI scoring and pedagogical improvement.
            </p>
          </div>

          {submissionSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Evaluation Submitted Successfully!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for your valuable feedback. The faculty performance KPI matrix and feedback analytics have been updated in real-time.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Select Faculty Member</label>
                  <select
                    value={selectedFacultyId}
                    onChange={(e) => {
                      setSelectedFacultyId(e.target.value);
                      const f = facultyList.find(fac => fac.id === e.target.value);
                      if (f && f.assignedSubjects?.length) {
                        setSubjectName(f.assignedSubjects[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
                    required
                  >
                    {facultyList.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Subject / Course Unit</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Distributed Operating Systems"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Star Rating Criteria Sliders / Stars */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Evaluation Dimensions (1 to 5 Stars)
                  </span>
                  <span className="text-slate-400 text-[11px]">Click or drag rating</span>
                </div>

                {/* Overall Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">1. Overall Teaching Effectiveness:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setOverallRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= overallRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                    <span className="font-mono font-bold text-amber-400 ml-2 w-6 text-center">{overallRating}★</span>
                  </div>
                </div>

                {/* Clarity */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">2. Concept Clarity & Presentation:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setClarityRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= clarityRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                    <span className="font-mono font-bold text-amber-400 ml-2 w-6 text-center">{clarityRating}★</span>
                  </div>
                </div>

                {/* Punctuality */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">3. Punctuality & Syllabus Pace:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setPunctualityRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= punctualityRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                    <span className="font-mono font-bold text-amber-400 ml-2 w-6 text-center">{punctualityRating}★</span>
                  </div>
                </div>

                {/* Doubt resolution */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">4. Doubt Clearance & Availability:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setDoubtRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= doubtRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                    <span className="font-mono font-bold text-amber-400 ml-2 w-6 text-center">{doubtRating}★</span>
                  </div>
                </div>

              </div>

              {/* Written Comments */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Constructive Comments & Suggestions
                </label>
                <textarea
                  rows="3"
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="Share details on course delivery, coding exercises, homework explanations, and classroom interaction..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('faculty')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Evaluation</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* Tab 3: Permitted Attendance & Schedule Information */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Permitted Academic Attendance & Schedule Stream
              </h3>
              <p className="text-xs text-slate-400">Class periods, assigned teachers, and SMS dispatch status</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              {currentUser?.branch || 'CSE'} Department
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3 text-center">Class Attendance</th>
                  <th className="p-3 text-center">SMS Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {studentBranchAttendance.map((rec) => {
                  const pct = Math.round((Number(rec.present) / (Number(rec.totalStudents) || 1)) * 100);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-amber-400">{rec.period}</td>
                      <td className="p-3 text-slate-400">{rec.time}</td>
                      <td className="p-3 font-medium text-white">{rec.subject}</td>
                      <td className="p-3 text-slate-300">{rec.teacher}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {pct}% Present
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          {rec.smsSent === 'Yes' ? '✓ Dispatched' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
