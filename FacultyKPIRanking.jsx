import React, { useState, useMemo } from 'react';
import { calculateOverallKpi } from '../utils/kpiCalculator';
import { 
  Award, 
  Trophy, 
  Medal, 
  Star, 
  BookOpen, 
  Briefcase, 
  ExternalLink, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react';

export default function FacultyKPIRanking({ 
  facultyList = [], 
  feedbacks = [], 
  kpiWeights, 
  onSelectFaculty 
}) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeModalFaculty, setActiveModalFaculty] = useState(null);

  const departments = ['All', ...new Set(facultyList.map(f => f.department).filter(Boolean))];

  // Calculate KPIs and sort into rankings
  const rankedFaculty = useMemo(() => {
    const list = facultyList.map(fac => {
      const kpi = calculateOverallKpi(fac, feedbacks, kpiWeights);
      return {
        ...fac,
        kpi
      };
    });

    // Filter department
    const filtered = selectedDept === 'All' 
      ? list 
      : list.filter(f => f.department === selectedDept);

    // Sort descending by overallScore
    return filtered.sort((a, b) => b.kpi.overallScore - a.kpi.overallScore);
  }, [facultyList, feedbacks, kpiWeights, selectedDept]);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-400/30">
          <Trophy className="w-4 h-4 text-slate-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-slate-300/30">
          <Medal className="w-4 h-4 text-slate-950" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-extrabold shadow-lg shadow-amber-700/30">
          <Medal className="w-4 h-4 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Faculty Performance Rankings & KPI Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Composite scoring based on Teaching (40%), Research (25%), Student Feedback (15%), Professional Dev (10%), Contributions (10%)
              </p>
            </div>
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800/80 bg-slate-950/40">
        {rankedFaculty.slice(0, 3).map((fac, idx) => {
          const rank = idx + 1;
          return (
            <div 
              key={fac.id}
              onClick={() => setActiveModalFaculty(fac)}
              className="relative p-4 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-amber-400/50 cursor-pointer transition-all duration-300 powerbi-card group"
            >
              <div className="absolute top-3 right-3">
                {getRankBadge(rank)}
              </div>

              <div className="flex items-center gap-3">
                <img 
                  src={fac.avatar} 
                  alt={fac.name} 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-amber-400/50 transition-all"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {fac.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{fac.designation}</p>
                  <p className="text-[10px] text-slate-500">{fac.department}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Overall KPI
                  </div>
                  <div className="text-xl font-extrabold text-amber-400">
                    {fac.kpi.overallScore}%
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{fac.kpi.ratingOutOfFive} / 5</span>
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    Grade {fac.kpi.grade}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
            <tr>
              <th className="py-3 px-4 text-center">Rank</th>
              <th className="py-3 px-4">Faculty Member</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-3 text-center">Teaching (40%)</th>
              <th className="py-3 px-3 text-center">Research (25%)</th>
              <th className="py-3 px-3 text-center">Feedback (15%)</th>
              <th className="py-3 px-3 text-center">Prof Dev (10%)</th>
              <th className="py-3 px-3 text-center">Contrib (10%)</th>
              <th className="py-3 px-4 text-center">Composite KPI</th>
              <th className="py-3 px-3 text-center">Rating</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {rankedFaculty.map((fac, index) => {
              const rank = index + 1;
              return (
                <tr key={fac.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      {getRankBadge(rank)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={fac.avatar}
                        alt={fac.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white">{fac.name}</div>
                        <div className="text-[11px] text-slate-400">{fac.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {fac.department}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400">
                    {fac.kpi.teachingScore}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-blue-400">
                    {fac.kpi.researchScore}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-amber-400">
                    {fac.kpi.feedbackScore}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-purple-400">
                    {fac.kpi.professionalScore}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-pink-400">
                    {fac.kpi.contributionScore}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      {fac.kpi.overallScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{fac.kpi.ratingOutOfFive}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveModalFaculty(fac)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Modal for Selected Faculty */}
      {activeModalFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeModalFaculty.avatar}
                  alt={activeModalFaculty.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{activeModalFaculty.name}</h3>
                  <p className="text-xs text-amber-400 font-medium">{activeModalFaculty.designation}</p>
                  <p className="text-xs text-slate-400">{activeModalFaculty.department}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{activeModalFaculty.qualification}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalFaculty(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* KPI Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall KPI</div>
                <div className="text-2xl font-black text-amber-400">{activeModalFaculty.kpi.overallScore}%</div>
                <div className="text-[10px] text-slate-500">Grade {activeModalFaculty.kpi.grade}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Teaching Score</div>
                <div className="text-2xl font-black text-emerald-400">{activeModalFaculty.kpi.teachingScore}%</div>
                <div className="text-[10px] text-slate-500">Weight 40%</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Research Score</div>
                <div className="text-2xl font-black text-blue-400">{activeModalFaculty.kpi.researchScore}%</div>
                <div className="text-[10px] text-slate-500">Weight 25%</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Student Feedback</div>
                <div className="text-2xl font-black text-amber-400">{activeModalFaculty.kpi.feedbackScore}%</div>
                <div className="text-[10px] text-slate-500">Rating {activeModalFaculty.kpi.ratingOutOfFive}/5</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Professional Dev</div>
                <div className="text-2xl font-black text-purple-400">{activeModalFaculty.kpi.professionalScore}%</div>
                <div className="text-[10px] text-slate-500">Weight 10%</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Dept Contribution</div>
                <div className="text-2xl font-black text-pink-400">{activeModalFaculty.kpi.contributionScore}%</div>
                <div className="text-[10px] text-slate-500">Weight 10%</div>
              </div>
            </div>

            {/* Research & Publications breakdown */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Research & Academic Portfolio
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-2">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <div className="text-lg font-bold text-white">{activeModalFaculty.research?.publications || 0}</div>
                  <div className="text-[10px] text-slate-400">Publications</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <div className="text-lg font-bold text-white">{activeModalFaculty.research?.conferences || 0}</div>
                  <div className="text-[10px] text-slate-400">Conferences</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <div className="text-lg font-bold text-white">{activeModalFaculty.research?.patents || 0}</div>
                  <div className="text-[10px] text-slate-400">Patents</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <div className="text-lg font-bold text-white">{activeModalFaculty.research?.researchProjects || 0}</div>
                  <div className="text-[10px] text-slate-400">Projects</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <div className="text-lg font-bold text-white">{activeModalFaculty.research?.books || 0}</div>
                  <div className="text-[10px] text-slate-400">Books</div>
                </div>
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Assigned Subjects & Batches
              </h4>
              <div className="space-y-1.5 pt-1">
                {activeModalFaculty.assignedSubjects?.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs">
                    <div>
                      <span className="font-semibold text-white">{sub.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({sub.code})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {sub.program} • {sub.branch} • {sub.semester}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalFaculty(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
