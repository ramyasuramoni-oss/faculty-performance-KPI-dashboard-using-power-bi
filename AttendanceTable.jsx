import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Clock, 
  UserCheck, 
  ChevronDown, 
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { exportToExcel, exportToCSV, triggerPrint } from '../utils/exportUtils';

export default function AttendanceTable({ 
  records = [], 
  isAdmin = false, 
  onAddClick, 
  onEditRecord, 
  onDeleteRecord,
  facultyFilter = null // if passed from Faculty portal to constrain view
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSemester, setFilterSemester] = useState('All');
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterSms, setFilterSms] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Extract unique options for filter dropdowns
  const programs = ['All', ...new Set(records.map(r => r.program).filter(Boolean))];
  const branches = ['All', ...new Set(records.map(r => r.branch).filter(Boolean))];
  const semesters = ['All', ...new Set(records.map(r => r.semester).filter(Boolean))];
  const periods = ['All', ...new Set(records.map(r => r.period).filter(Boolean))];

  // Filtering & Sorting
  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      // Faculty view restriction if applied
      if (facultyFilter && !item.teacher.toLowerCase().includes(facultyFilter.toLowerCase())) {
        return false;
      }

      // Search matches
      const matchesSearch = 
        !searchTerm ||
        item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.program?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram = filterProgram === 'All' || item.program === filterProgram;
      const matchesBranch = filterBranch === 'All' || item.branch === filterBranch;
      const matchesSemester = filterSemester === 'All' || item.semester === filterSemester;
      const matchesPeriod = filterPeriod === 'All' || item.period === filterPeriod;
      const matchesSms = filterSms === 'All' || item.smsSent === filterSms;

      return matchesSearch && matchesProgram && matchesBranch && matchesSemester && matchesPeriod && matchesSms;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Computed attendance % sort
      if (sortField === 'attendancePct') {
        valA = (a.present / (a.totalStudents || 1)) * 100;
        valB = (b.present / (b.totalStudents || 1)) * 100;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, facultyFilter, searchTerm, filterProgram, filterBranch, filterSemester, filterPeriod, filterSms, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 85) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (pct >= 75) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Daily Attendance & Class Records
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {filteredRecords.length} records
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time student headcount, SMS notifications status, and period monitoring
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => exportToExcel(filteredRecords, 'Attendance_KPI_Report.xlsx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download Excel spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel</span>
            </button>

            <button
              onClick={() => exportToCSV(filteredRecords, 'Attendance_KPI_Report.csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={triggerPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Print Table"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {isAdmin && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Subject, Faculty, Branch..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Program filter */}
          <div>
            <select
              value={filterProgram}
              onChange={(e) => { setFilterProgram(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {programs.map(p => (
                <option key={p} value={p}>Program: {p}</option>
              ))}
            </select>
          </div>

          {/* Branch filter */}
          <div>
            <select
              value={filterBranch}
              onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {branches.map(b => (
                <option key={b} value={b}>Branch: {b}</option>
              ))}
            </select>
          </div>

          {/* Semester filter */}
          <div>
            <select
              value={filterSemester}
              onChange={(e) => { setFilterSemester(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {semesters.map(s => (
                <option key={s} value={s}>Semester: {s}</option>
              ))}
            </select>
          </div>

          {/* Period filter */}
          <div>
            <select
              value={filterPeriod}
              onChange={(e) => { setFilterPeriod(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {periods.map(per => (
                <option key={per} value={per}>Period: {per}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold select-none">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('program')}>
                <div className="flex items-center gap-1">
                  Program / Branch
                  {sortField === 'program' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('semester')}>
                <div className="flex items-center gap-1">
                  Semester
                  {sortField === 'semester' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('period')}>
                <div className="flex items-center gap-1">
                  Period
                  {sortField === 'period' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('teacher')}>
                <div className="flex items-center gap-1">
                  Teacher
                  {sortField === 'teacher' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-3 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('totalStudents')}>
                Total
              </th>
              <th className="py-3 px-3 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('present')}>
                Present
              </th>
              <th className="py-3 px-3 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('absent')}>
                Absent
              </th>
              <th className="py-3 px-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('attendancePct')}>
                Attendance %
              </th>
              <th className="py-3 px-3 text-center">SMS Sent</th>
              {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item) => {
                const total = Number(item.totalStudents) || 1;
                const present = Number(item.present) || 0;
                const absent = Number(item.absent) || (total - present);
                const pct = Math.round((present / total) * 100);

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.program}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{item.branch}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 border border-slate-700/60 text-slate-300">
                        {item.semester}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-amber-400">
                      {item.period}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{item.subject}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.id} • {item.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{item.teacher}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.time}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-300">
                      {total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">
                      {present}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-rose-400">
                      {absent}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPercentageColor(pct)}`}>
                          {pct}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct >= 85 ? 'bg-emerald-400' : pct >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.smsSent === 'Yes' || item.smsSent === 'Sent' || item.smsSent === 'Delivered' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          No
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onEditRecord(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors mr-1"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 12 : 11} className="py-8 text-center text-slate-500">
                  No attendance records found matching the active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing page <span className="text-white font-semibold">{currentPage}</span> of{' '}
          <span className="text-white font-semibold">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
