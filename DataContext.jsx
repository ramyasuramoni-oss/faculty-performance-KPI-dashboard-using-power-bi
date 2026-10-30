import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialAttendanceRecords, 
  initialFaculty, 
  initialStudents, 
  initialFeedbacks, 
  initialKpiWeights,
  defaultPowerBiConfig 
} from '../data/initialData';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser, isAdmin } = useAuth();

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('portal_attendance_records');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  // Faculty List
  const [facultyList, setFacultyList] = useState(() => {
    const saved = localStorage.getItem('portal_faculty_list');
    return saved ? JSON.parse(saved) : initialFaculty;
  });

  // Students List
  const [studentsList, setStudentsList] = useState(() => {
    const saved = localStorage.getItem('portal_students_list');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Feedbacks List
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('portal_feedbacks_list');
    return saved ? JSON.parse(saved) : initialFeedbacks;
  });

  // KPI Weights Configuration
  const [kpiWeights, setKpiWeights] = useState(() => {
    const saved = localStorage.getItem('portal_kpi_weights');
    return saved ? JSON.parse(saved) : initialKpiWeights;
  });

  // Power BI Config
  const [powerBiConfig, setPowerBiConfig] = useState(() => {
    const saved = localStorage.getItem('portal_powerbi_config');
    return saved ? JSON.parse(saved) : defaultPowerBiConfig;
  });

  // Save to LocalStorage for offline and instant cache
  useEffect(() => {
    localStorage.setItem('portal_attendance_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('portal_faculty_list', JSON.stringify(facultyList));
  }, [facultyList]);

  useEffect(() => {
    localStorage.setItem('portal_students_list', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem('portal_feedbacks_list', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('portal_kpi_weights', JSON.stringify(kpiWeights));
  }, [kpiWeights]);

  useEffect(() => {
    localStorage.setItem('portal_powerbi_config', JSON.stringify(powerBiConfig));
  }, [powerBiConfig]);

  // Real-time Firestore synchronization if Firebase is active
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // 1. Attendance Listener
    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setAttendanceRecords(docs);
      }
    }, (err) => console.warn("Firestore attendance listener:", err.message));

    // 2. Faculty Listener
    const unsubFaculty = onSnapshot(collection(db, 'faculty'), (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setFacultyList(docs);
      }
    }, (err) => console.warn("Firestore faculty listener:", err.message));

    // 3. Students Listener
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudentsList(docs);
      }
    }, (err) => console.warn("Firestore students listener:", err.message));

    // 4. Feedbacks Listener
    const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setFeedbacks(docs);
      }
    }, (err) => console.warn("Firestore feedbacks listener:", err.message));

    // 5. KPI Weights Listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'kpiWeights'), (snapshot) => {
      if (snapshot.exists()) {
        setKpiWeights(snapshot.data());
      }
    }, (err) => console.warn("Firestore settings listener:", err.message));

    return () => {
      unsubAttendance();
      unsubFaculty();
      unsubStudents();
      unsubFeedbacks();
      unsubSettings();
    };
  }, []);

  // Helper for Firestore writes
  const writeToFirestore = async (collectionName, docId, data) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, String(docId)), data, { merge: true });
      } catch (err) {
        console.warn(`Firestore write error in ${collectionName}/${docId}:`, err.message);
      }
    }
  };

  const deleteFromFirestore = async (collectionName, docId) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, collectionName, String(docId)));
      } catch (err) {
        console.warn(`Firestore delete error in ${collectionName}/${docId}:`, err.message);
      }
    }
  };

  // --- ATTENDANCE CRUD ---
  const addAttendanceRecord = (record) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can add attendance records.');
    }
    const newRecord = {
      ...record,
      id: record.id || `ATT-${Date.now().toString().slice(-4)}`,
      totalStudents: Number(record.totalStudents || 0),
      present: Number(record.present || 0),
      absent: Number(record.absent !== undefined ? record.absent : (record.totalStudents - record.present) || 0)
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    writeToFirestore('attendance', newRecord.id, newRecord);
    return newRecord;
  };

  const updateAttendanceRecord = (updatedRecord) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can edit attendance records.');
    }
    const record = {
      ...updatedRecord,
      totalStudents: Number(updatedRecord.totalStudents || 0),
      present: Number(updatedRecord.present || 0),
      absent: Number(updatedRecord.absent !== undefined ? updatedRecord.absent : (updatedRecord.totalStudents - updatedRecord.present) || 0)
    };
    setAttendanceRecords(prev => prev.map(rec => rec.id === record.id ? record : rec));
    writeToFirestore('attendance', record.id, record);
    return record;
  };

  const deleteAttendanceRecord = (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can delete attendance records.');
    }
    setAttendanceRecords(prev => prev.filter(rec => rec.id !== id));
    deleteFromFirestore('attendance', id);
  };

  const bulkAddAttendanceRecords = (records) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can upload attendance records.');
    }
    const normalized = records.map((r, idx) => ({
      ...r,
      id: r.id || `ATT-${Date.now().toString().slice(-4)}-${idx}`,
      totalStudents: Number(r.totalStudents || r.TotalStudents || 0),
      present: Number(r.present || r.Present || 0),
      absent: Number(r.absent !== undefined ? r.absent : (r.Absent !== undefined ? r.Absent : 0)),
      smsSent: r.smsSent || r['SMS Sent'] || 'Yes'
    }));
    setAttendanceRecords(prev => [...normalized, ...prev]);
    normalized.forEach(item => writeToFirestore('attendance', item.id, item));
    return normalized;
  };

  // --- FACULTY CRUD ---
  const addFaculty = (facultyData) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can add faculty.');
    }
    const newFaculty = {
      ...facultyData,
      id: facultyData.id || `FAC-${Date.now().toString().slice(-3)}`,
      avatar: facultyData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(facultyData.name)}&background=F2C811&color=000`,
      teaching: {
        classesAssigned: Number(facultyData.teaching?.classesAssigned || 50),
        classesConducted: Number(facultyData.teaching?.classesConducted || 48),
        studentsTotal: Number(facultyData.teaching?.studentsTotal || 60),
        studentsPassed: Number(facultyData.teaching?.studentsPassed || 56),
        attendancePercentage: Number(facultyData.teaching?.attendancePercentage || 92)
      },
      research: {
        publications: Number(facultyData.research?.publications || 3),
        conferences: Number(facultyData.research?.conferences || 2),
        patents: Number(facultyData.research?.patents || 1),
        researchProjects: Number(facultyData.research?.researchProjects || 2),
        books: Number(facultyData.research?.books || 1)
      },
      development: {
        certifications: Number(facultyData.development?.certifications || 2),
        workshops: Number(facultyData.development?.workshops || 3),
        fdpAttended: Number(facultyData.development?.fdpAttended || 3)
      },
      contribution: {
        committeeWork: Number(facultyData.contribution?.committeeWork || 3),
        eventsConducted: Number(facultyData.contribution?.eventsConducted || 2),
        mentoringActivities: Number(facultyData.contribution?.mentoringActivities || 8)
      }
    };
    setFacultyList(prev => [...prev, newFaculty]);
    writeToFirestore('faculty', newFaculty.id, newFaculty);
    return newFaculty;
  };

  const updateFaculty = (updatedFaculty) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can edit faculty.');
    }
    setFacultyList(prev => prev.map(f => f.id === updatedFaculty.id ? updatedFaculty : f));
    writeToFirestore('faculty', updatedFaculty.id, updatedFaculty);
    return updatedFaculty;
  };

  const deleteFaculty = async (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can delete faculty.');
    }
    const facultyToDelete = facultyList.find(f => f.id === id);
    const facultyName = facultyToDelete?.name;

    // 1. Remove faculty from local state and Firestore
    setFacultyList(prev => prev.filter(f => f.id !== id));
    await deleteFromFirestore('faculty', id);

    // 2. Cascade delete related student feedbacks
    if (facultyToDelete) {
      const relatedFeedbacks = feedbacks.filter(
        f => f.facultyId === id || (facultyName && f.facultyName === facultyName)
      );
      if (relatedFeedbacks.length > 0) {
        setFeedbacks(prev => prev.filter(
          f => f.facultyId !== id && (!facultyName || f.facultyName !== facultyName)
        ));
        for (const fb of relatedFeedbacks) {
          await deleteFromFirestore('feedbacks', fb.id);
        }
      }
    }
  };

  // --- STUDENT REGISTRATION CRUD (ADMIN ONLY) ---
  const addStudent = (studentData) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can manually add students.');
    }
    const newStudent = {
      ...studentData,
      id: studentData.id || `STU-${Date.now().toString().slice(-4)}`,
      status: studentData.status || 'Approved',
      registrationDate: studentData.registrationDate || new Date().toISOString().split('T')[0],
      avatar: studentData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=2563EB&color=fff`
    };
    setStudentsList(prev => [newStudent, ...prev]);
    writeToFirestore('students', newStudent.id, newStudent);
    return newStudent;
  };

  const updateStudent = (updatedStudent) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can edit student details.');
    }
    setStudentsList(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    writeToFirestore('students', updatedStudent.id, updatedStudent);
    return updatedStudent;
  };

  const approveStudent = (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can approve student accounts.');
    }
    setStudentsList(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
    writeToFirestore('students', id, { status: 'Approved' });
  };

  const rejectStudent = (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can reject student accounts.');
    }
    setStudentsList(prev => prev.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    writeToFirestore('students', id, { status: 'Rejected' });
  };

  const deleteStudent = (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can delete student accounts.');
    }
    setStudentsList(prev => prev.filter(s => s.id !== id));
    deleteFromFirestore('students', id);
  };

  // --- FEEDBACK CRUD ---
  const submitFeedback = (feedbackData) => {
    // Authenticated students can submit feedback
    const newFeedback = {
      ...feedbackData,
      id: `FDB-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    writeToFirestore('feedbacks', newFeedback.id, newFeedback);
    return newFeedback;
  };

  const updateFeedback = (updatedFeedback) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can edit feedbacks.');
    }
    setFeedbacks(prev => prev.map(f => f.id === updatedFeedback.id ? updatedFeedback : f));
    writeToFirestore('feedbacks', updatedFeedback.id, updatedFeedback);
    return updatedFeedback;
  };

  const deleteFeedback = (id) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can delete feedback entries.');
    }
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    deleteFromFirestore('feedbacks', id);
  };

  // --- KPI WEIGHTS ACTIONS (ADMIN ONLY) ---
  const updateKpiWeights = (newWeights) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can update KPI weights.');
    }
    setKpiWeights(newWeights);
    writeToFirestore('settings', 'kpiWeights', newWeights);
  };

  // --- POWER BI ACTIONS ---
  const updatePowerBiConfig = (newConfig) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Only an Administrator can update Power BI configuration.');
    }
    setPowerBiConfig(prev => ({ ...prev, ...newConfig }));
    writeToFirestore('settings', 'powerBiConfig', newConfig);
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }
    setAttendanceRecords(initialAttendanceRecords);
    setFacultyList(initialFaculty);
    setStudentsList(initialStudents);
    setFeedbacks(initialFeedbacks);
    setKpiWeights(initialKpiWeights);
    setPowerBiConfig(defaultPowerBiConfig);
    localStorage.removeItem('portal_attendance_records');
    localStorage.removeItem('portal_faculty_list');
    localStorage.removeItem('portal_students_list');
    localStorage.removeItem('portal_feedbacks_list');
    localStorage.removeItem('portal_kpi_weights');
  };

  return (
    <DataContext.Provider value={{
      attendanceRecords,
      facultyList,
      studentsList,
      feedbacks,
      kpiWeights,
      powerBiConfig,
      // Attendance
      addAttendanceRecord,
      updateAttendanceRecord,
      deleteAttendanceRecord,
      bulkAddAttendanceRecords,
      // Faculty
      addFaculty,
      updateFaculty,
      deleteFaculty,
      // Students
      addStudent,
      updateStudent,
      approveStudent,
      rejectStudent,
      deleteStudent,
      // Feedback
      submitFeedback,
      updateFeedback,
      deleteFeedback,
      // Weights & Power BI
      updateKpiWeights,
      updatePowerBiConfig,
      resetToSampleData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
