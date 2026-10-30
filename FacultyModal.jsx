import React, { useState, useEffect } from 'react';
import { User, BookOpen, Award, FileText, Check, X, AlertCircle } from 'lucide-react';

export default function FacultyModal({ 
  isOpen, 
  onClose, 
  onSave, 
  facultyToEdit = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    joiningDate: new Date().toISOString().split('T')[0],
    experience: '12 Years (Teaching & Research)',
    experienceYears: 12,
    qualification: '',
    // Teaching metrics
    classesAssigned: 50,
    classesConducted: 48,
    studentsTotal: 60,
    studentsPassed: 55,
    attendancePercentage: 90,
    // Research metrics
    publications: 3,
    conferences: 2,
    patents: 1,
    researchProjects: 2,
    books: 1,
    // Professional Dev
    certifications: 2,
    workshops: 3,
    fdpAttended: 3,
    // Department Contribution
    committeeWork: 3,
    eventsConducted: 2,
    mentoringActivities: 8,
    // Assigned Subjects (comma separated string in input, parsed to array)
    subjectsInput: 'Distributed Operating Systems (CS501)'
  });

  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (facultyToEdit) {
      setFormData({
        name: facultyToEdit.name || '',
        email: facultyToEdit.email || '',
        phone: facultyToEdit.phone || '',
        designation: facultyToEdit.designation || 'Assistant Professor',
        department: facultyToEdit.department || 'Computer Science & Engineering',
        joiningDate: facultyToEdit.joiningDate || new Date().toISOString().split('T')[0],
        experience: facultyToEdit.experience || `${facultyToEdit.experienceYears || 10} Years`,
        experienceYears: facultyToEdit.experienceYears || 10,
        qualification: facultyToEdit.qualification || '',
        classesAssigned: facultyToEdit.teaching?.classesAssigned || 50,
        classesConducted: facultyToEdit.teaching?.classesConducted || 48,
        studentsTotal: facultyToEdit.teaching?.studentsTotal || 60,
        studentsPassed: facultyToEdit.teaching?.studentsPassed || 55,
        attendancePercentage: facultyToEdit.teaching?.attendancePercentage || 90,
        publications: facultyToEdit.research?.publications || 0,
        conferences: facultyToEdit.research?.conferences || 0,
        patents: facultyToEdit.research?.patents || 0,
        researchProjects: facultyToEdit.research?.researchProjects || 0,
        books: facultyToEdit.research?.books || 0,
        certifications: facultyToEdit.development?.certifications || 0,
        workshops: facultyToEdit.development?.workshops || 0,
        fdpAttended: facultyToEdit.development?.fdpAttended || 0,
        committeeWork: facultyToEdit.contribution?.committeeWork || 0,
        eventsConducted: facultyToEdit.contribution?.eventsConducted || 0,
        mentoringActivities: facultyToEdit.contribution?.mentoringActivities || 0,
        subjectsInput: facultyToEdit.assignedSubjects 
          ? facultyToEdit.assignedSubjects.map(s => `${s.name} (${s.code || ''})`).join(', ')
          : ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        designation: 'Assistant Professor',
        department: 'Computer Science & Engineering',
        joiningDate: new Date().toISOString().split('T')[0],
        qualification: 'M.Tech / Ph.D',
        classesAssigned: 50,
        classesConducted: 48,
        studentsTotal: 60,
        studentsPassed: 55,
        attendancePercentage: 90,
        publications: 3,
        conferences: 2,
        patents: 1,
        researchProjects: 2,
        books: 1,
        certifications: 2,
        workshops: 3,
        fdpAttended: 3,
        committeeWork: 3,
        eventsConducted: 2,
        mentoringActivities: 8,
        subjectsInput: 'Distributed Operating Systems (CS501)'
      });
    }
    setValidationError(null);
  }, [facultyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validations
    if (!formData.name.trim()) {
      setValidationError('Faculty name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('A valid institutional email is required.');
      return;
    }
    if (Number(formData.classesConducted) > Number(formData.classesAssigned)) {
      setValidationError('Classes conducted cannot exceed classes assigned.');
      return;
    }
    if (Number(formData.studentsPassed) > Number(formData.studentsTotal)) {
      setValidationError('Students passed cannot exceed total enrolled students.');
      return;
    }

    // Parse subjects string
    const subjectsArray = formData.subjectsInput.split(',').map(s => {
      const trimmed = s.trim();
      const codeMatch = trimmed.match(/\(([^)]+)\)/);
      const name = trimmed.replace(/\([^)]+\)/, '').trim();
      return {
        name: name || trimmed,
        code: codeMatch ? codeMatch[1] : 'CS101',
        program: 'B.Tech',
        branch: formData.department.includes('AI') ? 'AI & DS' : 'CSE',
        semester: 'Semester 5'
      };
    }).filter(s => s.name);

    const payload = {
      ...(facultyToEdit || {}),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      designation: formData.designation,
      department: formData.department,
      joiningDate: formData.joiningDate,
      experience: formData.experience.trim() || `${formData.experienceYears} Years`,
      experienceYears: Number(formData.experienceYears || 5),
      qualification: formData.qualification.trim(),
      assignedSubjects: subjectsArray,
      teaching: {
        classesAssigned: Number(formData.classesAssigned),
        classesConducted: Number(formData.classesConducted),
        studentsTotal: Number(formData.studentsTotal),
        studentsPassed: Number(formData.studentsPassed),
        attendancePercentage: Number(formData.attendancePercentage)
      },
      research: {
        publications: Number(formData.publications),
        conferences: Number(formData.conferences),
        patents: Number(formData.patents),
        researchProjects: Number(formData.researchProjects),
        books: Number(formData.books)
      },
      development: {
        certifications: Number(formData.certifications),
        workshops: Number(formData.workshops),
        fdpAttended: Number(formData.fdpAttended)
      },
      contribution: {
        committeeWork: Number(formData.committeeWork),
        eventsConducted: Number(formData.eventsConducted),
        mentoringActivities: Number(formData.mentoringActivities)
      }
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {facultyToEdit ? 'Edit Faculty Member & KPI Metrics' : 'Add New Faculty Member'}
              </h3>
              <p className="text-xs text-slate-400">
                Institutional credentials, assigned subjects, and 5-pillar performance metrics
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Profile & Institutional Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Sharma"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@faculty.edu"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Designation</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="Professor & Head of Department">Professor & HOD</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Adjunct Lecturer">Adjunct Lecturer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Electronics & Communication Engineering">ECE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Tenure Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Academic Qualifications</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Ph.D in Distributed Systems, IIT Delhi"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Academic & Research Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 15 Years (Teaching & Research)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Years of Experience (Numeric)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Assigned Courses (Comma separated)</label>
              <input
                type="text"
                value={formData.subjectsInput}
                onChange={(e) => setFormData({ ...formData, subjectsInput: e.target.value })}
                placeholder="Distributed OS (CS501), Cloud Computing (CS702)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Section 2: Teaching Performance Metrics */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              2. Teaching Performance (40% KPI Weight)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Classes Assigned</label>
                <input
                  type="number"
                  min="1"
                  value={formData.classesAssigned}
                  onChange={(e) => setFormData({ ...formData, classesAssigned: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Classes Conducted</label>
                <input
                  type="number"
                  min="0"
                  value={formData.classesConducted}
                  onChange={(e) => setFormData({ ...formData, classesConducted: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Total Students</label>
                <input
                  type="number"
                  min="1"
                  value={formData.studentsTotal}
                  onChange={(e) => setFormData({ ...formData, studentsTotal: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Students Passed</label>
                <input
                  type="number"
                  min="0"
                  value={formData.studentsPassed}
                  onChange={(e) => setFormData({ ...formData, studentsPassed: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Attendance %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendancePercentage}
                  onChange={(e) => setFormData({ ...formData, attendancePercentage: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Research Output */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              3. Research & Publications (25% KPI Weight)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Publications</label>
                <input
                  type="number"
                  min="0"
                  value={formData.publications}
                  onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Conferences</label>
                <input
                  type="number"
                  min="0"
                  value={formData.conferences}
                  onChange={(e) => setFormData({ ...formData, conferences: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Patents</label>
                <input
                  type="number"
                  min="0"
                  value={formData.patents}
                  onChange={(e) => setFormData({ ...formData, patents: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Projects</label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProjects}
                  onChange={(e) => setFormData({ ...formData, researchProjects: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Books Authored</label>
                <input
                  type="number"
                  min="0"
                  value={formData.books}
                  onChange={(e) => setFormData({ ...formData, books: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Professional Development & Contributions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                4. Professional Dev (10%)
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block">Certs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Workshops</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.workshops}
                    onChange={(e) => setFormData({ ...formData, workshops: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">FDPs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fdpAttended}
                    onChange={(e) => setFormData({ ...formData, fdpAttended: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                5. Department Contribution (10%)
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block">Committees</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.committeeWork}
                    onChange={(e) => setFormData({ ...formData, committeeWork: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Events</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.eventsConducted}
                    onChange={(e) => setFormData({ ...formData, eventsConducted: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Mentored</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mentoringActivities}
                    onChange={(e) => setFormData({ ...formData, mentoringActivities: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>
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
              className="px-6 py-2 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20"
            >
              {facultyToEdit ? 'Save Faculty Updates' : 'Add Faculty Member'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
