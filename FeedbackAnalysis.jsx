import React, { useState, useMemo } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Trash2, 
  Edit3,
  Filter, 
  HeartHandshake,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function FeedbackAnalysis({ 
  feedbacks = [], 
  facultyList = [], 
  isAdmin = false, 
  onEditFeedback,
  onDeleteFeedback 
}) {
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('All');

  const filteredFeedbacks = useMemo(() => {
    if (selectedFacultyFilter === 'All') return feedbacks;
    return feedbacks.filter(f => f.facultyName === selectedFacultyFilter || f.facultyId === selectedFacultyFilter);
  }, [feedbacks, selectedFacultyFilter]);

  // Calculations
  const stats = useMemo(() => {
    if (!filteredFeedbacks.length) {
      return {
        avgRating: 0,
        total: 0,
        clarityAvg: 0,
        punctualityAvg: 0,
        knowledgeAvg: 0,
        doubtAvg: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = filteredFeedbacks.length;
    let sumRating = 0;
    let sumClarity = 0;
    let sumPunctuality = 0;
    let sumKnowledge = 0;
    let sumDoubt = 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    filteredFeedbacks.forEach(f => {
      const r = Number(f.rating) || 5;
      sumRating += r;
      sumClarity += Number(f.clarity || r);
      sumPunctuality += Number(f.punctuality || r);
      sumKnowledge += Number(f.knowledge || r);
      sumDoubt += Number(f.doubtResolution || r);

      const bucket = Math.min(5, Math.max(1, Math.round(r)));
      distribution[bucket] = (distribution[bucket] || 0) + 1;
    });

    return {
      avgRating: Number((sumRating / total).toFixed(2)),
      total,
      clarityAvg: Number((sumClarity / total).toFixed(1)),
      punctualityAvg: Number((sumPunctuality / total).toFixed(1)),
      knowledgeAvg: Number((sumKnowledge / total).toFixed(1)),
      doubtAvg: Number((sumDoubt / total).toFixed(1)),
      distribution
    };
  }, [filteredFeedbacks]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Student Feedback & Sentiment Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated ratings across pedagogy, punctuality, course clarity, and doubt resolution
            </p>
          </div>
        </div>

        {/* Filter by Faculty */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Faculty:</span>
          <select
            value={selectedFacultyFilter}
            onChange={(e) => setSelectedFacultyFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="All">All Faculty Members</option>
            {facultyList.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rating Overview */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
            {stats.avgRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.avgRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Based on <span className="font-semibold text-white">{stats.total}</span> submitted student evaluations
          </p>
        </div>

        {/* Rating Distribution Bar */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Rating Distribution
          </div>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution[stars] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-slate-400 flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-mono text-[11px]">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Criteria Breakdown */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Pedagogical Dimension Averages
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Teaching Clarity:</span>
              <span className="font-bold text-emerald-400 font-mono">{stats.clarityAvg} / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Subject Knowledge:</span>
              <span className="font-bold text-blue-400 font-mono">{stats.knowledgeAvg} / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Punctuality & Pace:</span>
              <span className="font-bold text-amber-400 font-mono">{stats.punctualityAvg} / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Doubt Resolution:</span>
              <span className="font-bold text-purple-400 font-mono">{stats.doubtAvg} / 5.0</span>
            </div>
          </div>
        </div>

      </div>

      {/* Student Reviews Stream */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Recent Student Reviews & Qualitative Feedback
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((f) => (
            <div 
              key={f.id} 
              className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{f.facultyName}</h4>
                  <p className="text-[11px] text-amber-400/90">{f.subject}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{f.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic line-clamp-3">
                "{f.comments}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                <span>By: {f.studentName || f.studentRoll}</span>
                <div className="flex items-center gap-2">
                  <span>{f.date}</span>
                  {isAdmin && onEditFeedback && (
                    <button
                      onClick={() => onEditFeedback(f)}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                      title="Edit Feedback"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isAdmin && onDeleteFeedback && (
                    <button
                      onClick={() => onDeleteFeedback(f.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete Feedback"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
