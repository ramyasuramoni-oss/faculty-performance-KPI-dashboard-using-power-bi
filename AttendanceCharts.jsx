import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { PieChart as PieIcon, BarChart2, TrendingUp, Layers } from 'lucide-react';

const COLORS = ['#F2C811', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'];

export default function AttendanceCharts({ records = [] }) {
  
  // 1. Branch-wise Attendance %
  const branchData = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const b = r.branch?.replace('Computer Science & Engineering', 'CSE')
                         .replace('Artificial Intelligence & Data Science', 'AI & DS')
                         .replace('Electronics & Communication Engineering', 'ECE')
                         .replace('Information Technology', 'IT')
                         .replace('Mechanical Engineering', 'MECH') || 'Other';
      if (!map[b]) {
        map[b] = { branch: b, total: 0, present: 0 };
      }
      map[b].total += Number(r.totalStudents) || 0;
      map[b].present += Number(r.present) || 0;
    });

    return Object.values(map).map(item => ({
      branch: item.branch,
      attendancePct: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
      totalStudents: item.total,
      presentStudents: item.present
    }));
  }, [records]);

  // 2. Period-wise Present vs Absent
  const periodData = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const p = r.period || 'Period 1';
      if (!map[p]) {
        map[p] = { period: p, present: 0, absent: 0, total: 0 };
      }
      const pres = Number(r.present) || 0;
      const abs = Number(r.absent) || ((Number(r.totalStudents) || 0) - pres);
      map[p].present += pres;
      map[p].absent += abs;
      map[p].total += (pres + abs);
    });

    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period));
  }, [records]);

  // 3. SMS Delivery Status
  const smsData = useMemo(() => {
    let sent = 0;
    let notSent = 0;
    records.forEach(r => {
      if (r.smsSent === 'Yes' || r.smsSent === 'Sent' || r.smsSent === 'Delivered') {
        sent += 1;
      } else {
        notSent += 1;
      }
    });
    return [
      { name: 'SMS Delivered', value: sent, color: '#10B981' },
      { name: 'Pending / Not Sent', value: notSent, color: '#F43F5E' }
    ];
  }, [records]);

  // 4. Subject Attendance %
  const subjectData = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const s = r.subject || 'General';
      if (!map[s]) {
        map[s] = { subject: s, total: 0, present: 0 };
      }
      map[s].total += Number(r.totalStudents) || 0;
      map[s].present += Number(r.present) || 0;
    });

    return Object.values(map)
      .map(item => ({
        subject: item.subject.length > 18 ? item.subject.slice(0, 16) + '...' : item.subject,
        fullName: item.subject,
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0
      }))
      .slice(0, 6);
  }, [records]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-amber-400">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-slate-200 flex items-center justify-between gap-3">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-mono font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Branch-wise Attendance % */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl powerbi-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Branch-wise Attendance %
              </h3>
              <p className="text-[11px] text-slate-400">Average student presence rate by engineering department</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
            KPI Target: 85%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="branch" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="attendancePct" name="Attendance %" fill="#F2C811" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Period-wise Attendance (Present vs Absent) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl powerbi-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Period-wise Headcount Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Present vs Absent students across daily periods</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="present" name="Present Students" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="absent" name="Absent Students" fill="#F43F5E" stackId="a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Subject Attendance % Comparison */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl powerbi-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-400/10 rounded-lg text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Subject Attendance Comparison
              </h3>
              <p className="text-[11px] text-slate-400">Comparison across major course offerings</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <YAxis dataKey="subject" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" name="Attendance %" fill="#3B82F6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: SMS Notification Status Donut */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl powerbi-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-400/10 rounded-lg text-purple-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Absence SMS Notification Status
              </h3>
              <p className="text-[11px] text-slate-400">Automated parent & guardian SMS delivery status</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={smsData}
                innerRadius={55}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {smsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
