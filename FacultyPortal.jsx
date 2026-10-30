import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateOverallKpi } from '../utils/kpiCalculator';
import StatCard from '../components/StatCard';
import AttendanceTable from '../components/AttendanceTable';
import { 
  Briefcase, 
  BookOpen, 
  Star, 
  Calendar, 
  Mail, 
  Phone, 
  Award, 
  FileText, 
  GraduationCap, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Percent, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function FacultyPortal() {
  const { currentUser } = useAuth();
  const { facultyList, attendanceRecords, feedbacks, kpiWeights } = useData();

  // Find faculty profile matching logged in user or fallback to first faculty
  const facultyProfile = useMemo(() => {
    if (!currentUser) return facultyList[0];
    const match = facultyList.find(f => 
      f.id === currentUser.facultyId || 
      f.email.toLowerCase() === currentUser.email?.toLowerCase() ||
      f.name.toLowerCase().includes(currentUser.displayName?.toLowerCase() || '')
    );
    return match || facultyList[0];
  }, [currentUser, facultyList]);

  // Calculate this faculty's calculated KPI scores
  const kpi = useMemo(() => {
    return calculateOverallKpi(facultyProfile, feedbacks, kpiWeights);
  }, [facultyProfile, feedbacks, kpiWeights]);

  // Feedbacks received specifically for this faculty
  const facultyFeedbacks = useMemo(() => {
    return feedbacks.filter(f => 
      f.facultyId === facultyProfile.id || 
      f.facultyName.toLowerCase() === facultyProfile.name.toLowerCase()
    );
  }, [feedbacks, facultyProfile]);

  // Filter attendance records conducted by this faculty
  const facultyAttendance = useMemo(() => {
    return attendanceRecords.filter(r => 
      r.teacher?.toLowerCase().includes(facultyProfile.name.toLowerCase())
    );
  }, [attendanceRecords, facultyProfile]);

  // Compute average attendance rate in their classes
  const myTotalStudents = facultyAttendance.reduce((a, c) => a + (Number(c.totalStudents) || 0), 0);
  const myTotalPresent = facultyAttendance.reduce((a, c) => a + (Number(c.present) || 0), 0);
  const myAvgAttendancePct = myTotalStudents > 0 ? Math.round((myTotalPresent / myTotalStudents) * 100) : 92;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Read-Only Notice Badge */}
      <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Faculty Read-Only Dashboard • Evaluation & Performance KPI View</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Viewing Mode (No Edit Permissions)</span>
        </div>
      </div>

      {/* Faculty Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={facultyProfile.avatar}
              alt={facultyProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-400/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {facultyProfile.id}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {facultyProfile.name}
              </h1>
              <p className="text-sm text-amber-400 font-medium">
                {facultyProfile.designation}
              </p>
              <p className="text-xs text-slate-400">
                {facultyProfile.department}
              </p>
              <p className="text-xs text-slate-500 font-mono pt-0.5">
                {facultyProfile.qualification}
              </p>
            </div>
          </div>

          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="truncate">{facultyProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{facultyProfile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Joined: {facultyProfile.joiningDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Experience: <strong className="text-white">{facultyProfile.experience || `${facultyProfile.experienceYears || 10} Years`}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Composite KPI"
          value={`${kpi.overallScore}%`}
          subtitle={`Current Grade: ${kpi.grade}`}
          trend={`Ranked Grade ${kpi.grade}`}
          trendPositive={true}
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Teaching Score"
          value={`${kpi.teachingScore}%`}
          subtitle="Completion & pass rate benchmark"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Student Feedback"
          value={`${kpi.ratingOutOfFive} / 5.0`}
          subtitle={`Score: ${kpi.feedbackScore}% (${facultyFeedbacks.length} reviews)`}
          trend={`${kpi.ratingOutOfFive} ★`}
          trendPositive={true}
          icon={Star}
          color="purple"
        />
        <StatCard
          title="Class Attendance Rate"
          value={`${myAvgAttendancePct}%`}
          subtitle={`${facultyAttendance.length} classes logged`}
          icon={Percent}
          color="blue"
        />
      </div>

      {/* Assigned Subjects & Course Load */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Assigned Teaching Curriculum & Subject Allocation
              </h3>
              <p className="text-xs text-slate-400">Current academic semester courses and lab allocations</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
            {facultyProfile.assignedSubjects?.length || 0} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facultyProfile.assignedSubjects?.map((sub, idx) => (
            <div 
              key={idx}
              className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 hover:border-amber-400/30 transition-all powerbi-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{sub.code}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {sub.semester}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs text-slate-400">
                <span>{sub.program} • {sub.branch}</span>
                <span className="text-emerald-400 font-medium">Active Instruction</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive KPI Performance Dimensions */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Institutional KPI Score Breakdown
            </h3>
            <p className="text-xs text-slate-400">Pillar-by-pillar scores calculated using institutional weighting algorithms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Research & Publications */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Research Output (25%)
              </h4>
              <span className="text-xs font-bold text-white font-mono">{kpi.researchScore}%</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Publications:</span>
                <span className="font-bold text-white">{facultyProfile.research?.publications || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conferences:</span>
                <span className="font-bold text-white">{facultyProfile.research?.conferences || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patents Granted:</span>
                <span className="font-bold text-white">{facultyProfile.research?.patents || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Research Projects:</span>
                <span className="font-bold text-white">{facultyProfile.research?.researchProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Books / Chapters:</span>
                <span className="font-bold text-white">{facultyProfile.research?.books || 0}</span>
              </div>
            </div>
          </div>

          {/* Professional Development */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Professional Dev (10%)
              </h4>
              <span className="text-xs font-bold text-white font-mono">{kpi.professionalScore}%</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Global Certifications:</span>
                <span className="font-bold text-white">{facultyProfile.development?.certifications || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Workshops Attended:</span>
                <span className="font-bold text-white">{facultyProfile.development?.workshops || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">FDPs Attended:</span>
                <span className="font-bold text-white">{facultyProfile.development?.fdpAttended || 0}</span>
              </div>
            </div>
          </div>

          {/* Department Contribution */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Dept Contribution (10%)
              </h4>
              <span className="text-xs font-bold text-white font-mono">{kpi.contributionScore}%</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Committee Work:</span>
                <span className="font-bold text-white">{facultyProfile.contribution?.committeeWork || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Events Conducted:</span>
                <span className="font-bold text-white">{facultyProfile.contribution?.eventsConducted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Students Mentored:</span>
                <span className="font-bold text-white">{facultyProfile.contribution?.mentoringActivities || 0}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Read-Only Attendance Table (Filtered for this faculty) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            My Class Attendance Log & SMS Alert Records
          </h3>
          <span className="text-xs text-slate-400 font-medium">Read-Only Mode</span>
        </div>
        <AttendanceTable
          records={attendanceRecords}
          isAdmin={false} // READ-ONLY: No edit or delete buttons!
          facultyFilter={facultyProfile.name}
        />
      </div>

      {/* Student Feedback Reviews for this faculty */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Student Feedback & Comments ({facultyFeedbacks.length})
              </h3>
              <p className="text-xs text-slate-400">Anonymous appraisals and reviews submitted by enrolled students</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{kpi.ratingOutOfFive} / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facultyFeedbacks.map((f) => (
            <div 
              key={f.id}
              className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{f.subject}</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {f.rating}
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "{f.comments}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                <span>Evaluated on: {f.date}</span>
                <span className="text-emerald-400">Verified Submission</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
