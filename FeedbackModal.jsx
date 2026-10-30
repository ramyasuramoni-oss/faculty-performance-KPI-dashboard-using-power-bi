import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, X, AlertCircle } from 'lucide-react';

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSave, 
  feedbackToEdit = null,
  facultyList = []
}) {
  const [formData, setFormData] = useState({
    facultyId: facultyList[0]?.id || 'FAC-101',
    facultyName: facultyList[0]?.name || 'Dr. Ramesh Sharma',
    subject: facultyList[0]?.assignedSubjects?.[0]?.name || 'Distributed Operating Systems',
    studentRoll: '21CS045',
    studentName: 'Aarav Sharma',
    rating: 5,
    clarity: 5,
    punctuality: 5,
    knowledge: 5,
    doubtResolution: 5,
    comments: 'Excellent subject mastery, clear pace, and approachable mentoring.'
  });

  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (feedbackToEdit) {
      setFormData({
        facultyId: feedbackToEdit.facultyId || facultyList[0]?.id || '',
        facultyName: feedbackToEdit.facultyName || facultyList[0]?.name || '',
        subject: feedbackToEdit.subject || '',
        studentRoll: feedbackToEdit.studentRoll || '',
        studentName: feedbackToEdit.studentName || '',
        rating: Number(feedbackToEdit.rating || 5),
        clarity: Number(feedbackToEdit.clarity || 5),
        punctuality: Number(feedbackToEdit.punctuality || 5),
        knowledge: Number(feedbackToEdit.knowledge || 5),
        doubtResolution: Number(feedbackToEdit.doubtResolution || 5),
        comments: feedbackToEdit.comments || ''
      });
    } else {
      setFormData({
        facultyId: facultyList[0]?.id || '',
        facultyName: facultyList[0]?.name || '',
        subject: facultyList[0]?.assignedSubjects?.[0]?.name || '',
        studentRoll: '21CS045',
        studentName: 'Student Evaluator',
        rating: 5,
        clarity: 5,
        punctuality: 5,
        knowledge: 5,
        doubtResolution: 5,
        comments: ''
      });
    }
    setValidationError(null);
  }, [feedbackToEdit, facultyList, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.comments.trim()) {
      setValidationError('Feedback qualitative comments are required.');
      return;
    }

    onSave({
      ...(feedbackToEdit || {}),
      facultyId: formData.facultyId,
      facultyName: formData.facultyName,
      subject: formData.subject.trim(),
      studentRoll: formData.studentRoll.trim(),
      studentName: formData.studentName.trim(),
      rating: Number(formData.rating),
      clarity: Number(formData.clarity),
      punctuality: Number(formData.punctuality),
      knowledge: Number(formData.knowledge),
      doubtResolution: Number(formData.doubtResolution),
      comments: formData.comments.trim(),
      date: feedbackToEdit?.date || new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {feedbackToEdit ? 'Edit Feedback Entry' : 'Add Student Evaluation Record'}
              </h3>
              <p className="text-xs text-slate-400">Manage course evaluations and ratings</p>
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
              <label className="block text-slate-400 mb-1 font-medium">Faculty Member</label>
              <select
                value={formData.facultyId}
                onChange={(e) => {
                  const sel = facultyList.find(f => f.id === e.target.value);
                  setFormData({
                    ...formData,
                    facultyId: e.target.value,
                    facultyName: sel ? sel.name : '',
                    subject: sel?.assignedSubjects?.[0]?.name || formData.subject
                  });
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {facultyList.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Subject / Course</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Student Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Student Roll No</label>
              <input
                type="text"
                value={formData.studentRoll}
                onChange={(e) => setFormData({ ...formData, studentRoll: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Scores (1 to 5 Stars)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block text-[11px]">Overall Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block text-[11px]">Concept Clarity</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.clarity}
                  onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block text-[11px]">Punctuality</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.punctuality}
                  onChange={(e) => setFormData({ ...formData, punctuality: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Comments & Appraisal</label>
            <textarea
              rows="3"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
              required
            />
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
              className="px-5 py-2 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20"
            >
              {feedbackToEdit ? 'Save Changes' : 'Add Evaluation'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
