import React, { useState, useEffect } from 'react';
import { GraduationCap, X, AlertCircle } from 'lucide-react';

export default function StudentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  studentToEdit = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    status: 'Approved',
    attendanceRate: 95
  });

  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        rollNumber: studentToEdit.rollNumber || '',
        program: studentToEdit.program || 'B.Tech',
        branch: studentToEdit.branch || 'Computer Science & Engineering',
        semester: studentToEdit.semester || 'Semester 5',
        status: studentToEdit.status || 'Approved',
        attendanceRate: studentToEdit.attendanceRate || 95
      });
    } else {
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        program: 'B.Tech',
        branch: 'Computer Science & Engineering',
        semester: 'Semester 5',
        status: 'Approved',
        attendanceRate: 95
      });
    }
    setValidationError(null);
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Student name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Valid email address is required.');
      return;
    }
    if (!formData.rollNumber.trim()) {
      setValidationError('Roll Number / USN is required.');
      return;
    }

    onSave({
      ...(studentToEdit || {}),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      program: formData.program,
      branch: formData.branch,
      semester: formData.semester,
      status: formData.status,
      attendanceRate: Number(formData.attendanceRate || 90)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {studentToEdit ? 'Edit Student Details' : 'Add New Student Record'}
              </h3>
              <p className="text-xs text-slate-400">Manage student enrollment, branch allocation, and approval status</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Yeshwanth"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Roll Number / USN</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="21CS099"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white uppercase font-mono font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@student.edu"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Artificial Intelligence & Data Science">AI & DS</option>
                <option value="Electronics & Communication Engineering">ECE</option>
                <option value="Information Technology">IT</option>
                <option value="Mechanical Engineering">Mechanical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Registration Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Attendance Rate %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendanceRate}
                onChange={(e) => setFormData({ ...formData, attendanceRate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-blue-500 hover:bg-blue-400 text-white shadow-md shadow-blue-500/20"
            >
              {studentToEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
