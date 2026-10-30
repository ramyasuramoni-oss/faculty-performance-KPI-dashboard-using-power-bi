import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  Check, 
  X, 
  Layers 
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

export default function DataUploadModal({ 
  isOpen, 
  onClose, 
  onAddRecord, 
  onUpdateRecord, 
  onBulkAdd, 
  recordToEdit = null,
  facultyList = []
}) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'
  
  // Single entry form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    period: 'Period 1',
    subject: 'Data Structures & Algorithms',
    totalStudents: 60,
    present: 54,
    absent: 6,
    time: '09:00 AM - 10:00 AM',
    teacher: 'Dr. Ramesh Sharma',
    smsSent: 'Yes'
  });

  // Bulk upload state
  const [parsedRows, setParsedRows] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setFormData(recordToEdit);
      setActiveTab('single');
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        program: 'B.Tech',
        branch: 'Computer Science & Engineering',
        semester: 'Semester 5',
        period: 'Period 1',
        subject: '',
        totalStudents: 60,
        present: 55,
        absent: 5,
        time: '09:00 AM - 10:00 AM',
        teacher: facultyList[0]?.name || 'Dr. Ramesh Sharma',
        smsSent: 'Yes'
      });
    }
  }, [recordToEdit, facultyList, isOpen]);

  if (!isOpen) return null;

  // Handle total / present changes with auto-calculated absent
  const handleHeadcountChange = (field, value) => {
    const num = Math.max(0, Number(value));
    setFormData(prev => {
      const updated = { ...prev, [field]: num };
      if (field === 'totalStudents') {
        const pres = Math.min(num, prev.present);
        updated.present = pres;
        updated.absent = Math.max(0, num - pres);
      } else if (field === 'present') {
        updated.absent = Math.max(0, prev.totalStudents - num);
      }
      return updated;
    });
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (recordToEdit) {
      onUpdateRecord(formData);
    } else {
      onAddRecord(formData);
    }
    onClose();
  };

  // Handle CSV/Excel File parse
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (!json || !json.length) {
          setUploadError('The selected file appears to be empty.');
          setIsProcessing(false);
          return;
        }

        // Map column names flexibly
        const mapped = json.map((row, idx) => ({
          date: row.Date || row.date || new Date().toISOString().split('T')[0],
          program: row.Program || row.program || 'B.Tech',
          branch: row.Branch || row.branch || 'CSE',
          semester: row.Semester || row.semester || 'Semester 5',
          period: row.Period || row.period || `Period ${idx % 6 + 1}`,
          subject: row.Subject || row.subject || 'Course Subject',
          totalStudents: Number(row['Total Students'] || row.TotalStudents || row.totalStudents || 60),
          present: Number(row.Present || row.present || 55),
          absent: Number(row.Absent || row.absent || 5),
          time: row.Time || row.time || '10:00 AM - 11:00 AM',
          teacher: row.Teacher || row.Faculty || row.teacher || 'Faculty Member',
          smsSent: row['SMS Sent'] || row.smsSent || row.SMS || 'Yes'
        }));

        setParsedRows(mapped);
        setIsProcessing(false);
      } catch (err) {
        setUploadError(`Failed to parse file: ${err.message}. Please use the template format.`);
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleBulkCommit = () => {
    if (!parsedRows.length) return;
    onBulkAdd(parsedRows);
    onClose();
  };

  const handleDownloadSampleTemplate = () => {
    const sample = [
      {
        Program: "B.Tech",
        Branch: "Computer Science & Engineering",
        Semester: "Semester 5",
        Period: "Period 1",
        Subject: "Data Structures & Algorithms",
        "Total Students": 60,
        Present: 54,
        Absent: 6,
        Time: "09:00 AM - 10:00 AM",
        Teacher: "Dr. Ramesh Sharma",
        "SMS Sent": "Yes"
      },
      {
        Program: "B.Tech",
        Branch: "Artificial Intelligence & Data Science",
        Semester: "Semester 4",
        Period: "Period 2",
        Subject: "Machine Learning Foundations",
        "Total Students": 65,
        Present: 60,
        Absent: 5,
        Time: "10:00 AM - 11:00 AM",
        Teacher: "Prof. Ananya Iyer",
        "SMS Sent": "Yes"
      }
    ];
    exportToCSV(sample, 'Attendance_Template.csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {recordToEdit ? 'Edit Attendance Record' : 'Add or Upload Attendance Data'}
              </h3>
              <p className="text-xs text-slate-400">
                Single manual entry or bulk import via Excel (.xlsx) / CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (only if not editing) */}
        {!recordToEdit && (
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('single')}
              className={`pb-2.5 px-4 flex items-center gap-2 transition-all ${
                activeTab === 'single'
                  ? 'border-b-2 border-amber-400 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`pb-2.5 px-4 flex items-center gap-2 transition-all ${
                activeTab === 'bulk'
                  ? 'border-b-2 border-amber-400 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bulk Excel / CSV Upload</span>
            </button>
          </div>
        )}

        {/* Tab 1: Single Manual Entry */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Branch / Department</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Subject Name</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Teacher / Faculty</label>
                <select
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {facultyList.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Time Slot</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="10:00 AM - 11:00 AM"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Total Students</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalStudents}
                  onChange={(e) => handleHeadcountChange('totalStudents', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Present Students</label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalStudents}
                  value={formData.present}
                  onChange={(e) => handleHeadcountChange('present', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Absent (Auto)</label>
                <input
                  type="number"
                  value={formData.absent}
                  disabled
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-rose-400 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">SMS Sent to Absent Guardians?</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="smsSent"
                    value="Yes"
                    checked={formData.smsSent === 'Yes'}
                    onChange={() => setFormData({ ...formData, smsSent: 'Yes' })}
                    className="accent-amber-400"
                  />
                  <span className="text-slate-200">Yes (Delivered)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="smsSent"
                    value="No"
                    checked={formData.smsSent === 'No'}
                    onChange={() => setFormData({ ...formData, smsSent: 'No' })}
                    className="accent-amber-400"
                  />
                  <span className="text-slate-200">No (Pending)</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 transition-colors"
              >
                {recordToEdit ? 'Save Changes' : 'Add Attendance Record'}
              </button>
            </div>

          </form>
        )}

        {/* Tab 2: Bulk CSV/Excel Upload */}
        {activeTab === 'bulk' && (
          <div className="space-y-4 text-xs">
            
            {/* Download Template Banner */}
            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-300">Need a sample template?</p>
                <p className="text-[11px] text-slate-400">Download the formatted CSV file with required columns</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template .csv</span>
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition-colors">
              <Upload className="w-8 h-8 text-amber-400 mb-2" />
              <p className="font-bold text-white mb-1">Click to browse or drop attendance file</p>
              <p className="text-[11px] text-slate-400">Supports .xlsx, .xls, and .csv files</p>
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Parsed Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Ready to import {parsedRows.length} attendance rows
                  </span>
                  <span className="text-slate-400 text-[11px]">Previewing first 3 rows</span>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-[11px] text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Branch</th>
                        <th className="p-2">Period</th>
                        <th className="p-2">Teacher</th>
                        <th className="p-2 text-center">Total</th>
                        <th className="p-2 text-center">Present</th>
                        <th className="p-2 text-center">Absent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {parsedRows.slice(0, 3).map((r, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium text-white">{r.subject}</td>
                          <td className="p-2">{r.branch}</td>
                          <td className="p-2">{r.period}</td>
                          <td className="p-2">{r.teacher}</td>
                          <td className="p-2 text-center">{r.totalStudents}</td>
                          <td className="p-2 text-center text-emerald-400 font-bold">{r.present}</td>
                          <td className="p-2 text-center text-rose-400 font-bold">{r.absent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setParsedRows([])}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkCommit}
                    className="px-5 py-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  >
                    Confirm & Import {parsedRows.length} Records
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
