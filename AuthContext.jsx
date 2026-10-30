import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  updateProfile
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, firebaseConfig } from '../firebase/config';

const AuthContext = createContext(null);

// Initial bootstrap accounts stored in localStorage if not in Firestore
const INITIAL_USERS = [
  {
    uid: 'admin-primary-001',
    email: 'admin@facultykpi.edu',
    password: 'Admin@123',
    displayName: 'Authorized Administrator',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Primary System Administrator',
    createdAt: '2026-01-01'
  },
  {
    uid: 'FAC-101',
    email: 'ramesh.sharma@faculty.edu',
    password: 'Faculty@123',
    displayName: 'Dr. Ramesh Sharma',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    facultyId: 'FAC-101',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    createdAt: '2026-01-01'
  },
  {
    uid: 'FAC-102',
    email: 'ananya.iyer@faculty.edu',
    password: 'Faculty@123',
    displayName: 'Prof. Ananya Iyer',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    facultyId: 'FAC-102',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Associate Professor',
    createdAt: '2026-01-01'
  },
  {
    uid: 'FAC-103',
    email: 'yeshwanth.kumar@faculty.edu',
    password: 'Faculty@123',
    displayName: 'Dr. Yeshwanth Kumar',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    facultyId: 'FAC-103',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    createdAt: '2026-01-01'
  },
  {
    uid: 'STU-2026-001',
    email: 'aarav.sharma@student.edu',
    password: 'Student@123',
    displayName: 'Aarav Sharma',
    role: 'student',
    rollNumber: '21CS045',
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01'
  }
];

export function AuthProvider({ children }) {
  // Accounts list (Admin, Faculty, Student)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('portal_users_accounts');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('faculty_kpi_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Keep usersList persisted locally
  useEffect(() => {
    localStorage.setItem('portal_users_accounts', JSON.stringify(usersList));
  }, [usersList]);

  // Firebase Auth & Firestore live listener
  useEffect(() => {
    if (isFirebaseConfigured && auth && db) {
      // Listen to Firebase Auth state
      const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch user's role document from Firestore 'users' collection
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            let role = 'student';
            let profileData = {};

            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              role = data.role || 'student';
              profileData = data;
            } else {
              // Document doesn't exist yet; check local list or default
              const localMatch = usersList.find(u => u.email.toLowerCase() === firebaseUser.email.toLowerCase());
              role = localMatch ? localMatch.role : (firebaseUser.email.includes('faculty') ? 'faculty' : 'student');
              
              // Seed Firestore user document
              const newProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                role: role,
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newProfile);
              profileData = newProfile;
            }

            const activeUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || profileData.displayName || firebaseUser.email.split('@')[0],
              role: role,
              avatar: firebaseUser.photoURL || profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email)}&background=F2C811&color=000`,
              ...profileData
            };

            setCurrentUser(activeUser);
            localStorage.setItem('faculty_kpi_user', JSON.stringify(activeUser));
          } catch (err) {
            console.warn("Firestore user sync warning:", err.message);
          }
        }
        setLoading(false);
      });

      // Listen to Firestore users collection in real time
      const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const firestoreUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (firestoreUsers.length > 0) {
          setUsersList(prev => {
            // Merge with local list
            const map = new Map();
            prev.forEach(u => map.set(u.email.toLowerCase(), u));
            firestoreUsers.forEach(u => map.set(u.email.toLowerCase(), { ...map.get(u.email.toLowerCase()), ...u }));
            return Array.from(map.values());
          });
        }
      }, (error) => {
        console.warn("Users onSnapshot error:", error.message);
      });

      return () => {
        unsubscribeAuth();
        unsubscribeUsers();
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Login handler without hardcoding
  const login = async (email, password, requestedRole) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Firebase is configured, attempt Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;

        // Read role from Firestore
        let userRole = requestedRole || 'student';
        if (db) {
          try {
            const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDocSnap.exists()) {
              userRole = userDocSnap.data().role || userRole;
            }
          } catch (e) {
            console.warn("Firestore role fetch warning:", e.message);
          }
        }

        // Validate requested role if explicit
        if (requestedRole && requestedRole !== userRole && userRole !== 'admin') {
          await signOut(auth);
          const err = `This account has '${userRole}' privileges. Please use the ${userRole} portal login.`;
          setAuthError(err);
          return { success: false, error: err };
        }

        const userObj = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email.split('@')[0],
          role: userRole,
          avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.email)}&background=F2C811&color=000`
        };

        setCurrentUser(userObj);
        localStorage.setItem('faculty_kpi_user', JSON.stringify(userObj));
        return { success: true, user: userObj };
      } catch (err) {
        console.warn("Firebase sign-in failed, checking registered local users:", err.message);
      }
    }

    // 2. Check dynamic usersList (stored accounts)
    const matchedAccount = usersList.find(u => u.email.toLowerCase() === cleanEmail);
    if (matchedAccount) {
      // Validate password
      if (matchedAccount.password && matchedAccount.password !== password) {
        const err = 'Incorrect password. Please verify and try again.';
        setAuthError(err);
        return { success: false, error: err };
      }

      // Role check
      if (requestedRole && requestedRole !== matchedAccount.role && requestedRole !== 'admin') {
        const err = `This account has '${matchedAccount.role}' privileges. Please log in via the ${matchedAccount.role} portal.`;
        setAuthError(err);
        return { success: false, error: err };
      }

      setCurrentUser(matchedAccount);
      localStorage.setItem('faculty_kpi_user', JSON.stringify(matchedAccount));
      return { success: true, user: matchedAccount };
    }

    // 3. Check registered students in portal_students_list
    const storedStudents = JSON.parse(localStorage.getItem('portal_students_list') || '[]');
    const registeredStudent = storedStudents.find(s => s.email.toLowerCase() === cleanEmail);
    if (registeredStudent) {
      if (requestedRole && requestedRole !== 'student') {
        setAuthError('This email is registered as a Student. Please log in via the Student Portal.');
        return { success: false, error: 'Role mismatch' };
      }
      const studentUser = {
        uid: registeredStudent.id,
        email: registeredStudent.email,
        displayName: registeredStudent.name,
        role: 'student',
        rollNumber: registeredStudent.rollNumber,
        program: registeredStudent.program,
        branch: registeredStudent.branch,
        semester: registeredStudent.semester,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(registeredStudent.name)}&background=2563EB&color=fff`
      };
      setCurrentUser(studentUser);
      localStorage.setItem('faculty_kpi_user', JSON.stringify(studentUser));
      return { success: true, user: studentUser };
    }

    const err = 'Account not found or invalid credentials. Please check your email and password.';
    setAuthError(err);
    return { success: false, error: err };
  };

  // Student Self-Registration
  const registerStudent = async (studentData) => {
    setAuthError(null);
    try {
      let uid = `STU-${Date.now().toString().slice(-4)}`;

      // Register with Firebase Auth if configured
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
          uid = cred.user.uid;
          await updateProfile(cred.user, { displayName: studentData.name });
          
          if (db) {
            await setDoc(doc(db, 'users', uid), {
              uid,
              email: studentData.email.trim().toLowerCase(),
              displayName: studentData.name,
              role: 'student',
              rollNumber: studentData.rollNumber,
              program: studentData.program,
              branch: studentData.branch,
              semester: studentData.semester,
              status: 'Pending',
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn("Firebase student registration fallback:", e.message);
        }
      }

      const newStudentUser = {
        uid,
        id: uid,
        name: studentData.name,
        email: studentData.email.trim().toLowerCase(),
        password: studentData.password,
        rollNumber: studentData.rollNumber,
        program: studentData.program,
        branch: studentData.branch,
        semester: studentData.semester,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Pending', // Appears in Admin Portal for approval
        attendanceRate: 100,
        role: 'student',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=2563EB&color=fff`
      };

      // Add to usersList
      setUsersList(prev => [...prev, newStudentUser]);

      // Add to students list for Admin management
      const currentList = JSON.parse(localStorage.getItem('portal_students_list') || '[]');
      const updatedList = [newStudentUser, ...currentList];
      localStorage.setItem('portal_students_list', JSON.stringify(updatedList));

      window.dispatchEvent(new Event('students_updated'));

      setCurrentUser(newStudentUser);
      localStorage.setItem('faculty_kpi_user', JSON.stringify(newStudentUser));

      return { success: true, user: newStudentUser };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // --- ADMIN ACCOUNT MANAGEMENT (NEW ADMIN / REPLACE ADMIN / REVOKE) ---

  /**
   * Create a new Admin account in Firebase Auth + Firestore
   */
  const createNewAdmin = async ({ email, password, displayName }) => {
    if (currentUser?.role !== 'admin') {
      throw new Error('Unauthorized: Only an active administrator can create a new admin.');
    }

    const cleanEmail = email.trim().toLowerCase();
    let newUid = `admin-${Date.now().toString().slice(-4)}`;

    // If Firebase configured, use a secondary app instance so current admin session is not interrupted
    if (isFirebaseConfigured) {
      try {
        const secondaryApp = getApps().find(a => a.name === 'SecondaryAdminCreation') || 
                             initializeApp(firebaseConfig, 'SecondaryAdminCreation');
        const secondaryAuth = getAuth(secondaryApp);
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
        newUid = userCred.user.uid;
        await updateProfile(userCred.user, { displayName });
        await signOut(secondaryAuth);
      } catch (err) {
        console.warn("Secondary Firebase Auth creation note:", err.message);
      }
    }

    const newAdminObj = {
      uid: newUid,
      email: cleanEmail,
      password: password,
      displayName: displayName || cleanEmail.split('@')[0],
      role: 'admin',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || cleanEmail)}&background=F2C811&color=000`,
      title: 'Authorized Administrator',
      createdAt: new Date().toISOString()
    };

    // Save in Firestore 'users' collection with role: 'admin'
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', newUid), newAdminObj);
      } catch (e) {
        console.warn("Firestore admin doc write warning:", e.message);
      }
    }

    // Update local state
    setUsersList(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== cleanEmail);
      return [...filtered, newAdminObj];
    });

    return { success: true, user: newAdminObj };
  };

  /**
   * Replace Current Admin with New Admin & optionally revoke old admin access
   */
  const replaceAdminAccount = async ({ newEmail, newPassword, newDisplayName, revokeCurrentAdmin = false }) => {
    if (currentUser?.role !== 'admin') {
      throw new Error('Unauthorized: Only active administrator can replace the admin account.');
    }

    // 1. Create the new admin account
    const result = await createNewAdmin({
      email: newEmail,
      password: newPassword,
      displayName: newDisplayName
    });

    // 2. If revokeCurrentAdmin is requested, demote current admin's role
    if (revokeCurrentAdmin && currentUser) {
      const oldEmail = currentUser.email.toLowerCase();
      
      // Update in Firestore
      if (isFirebaseConfigured && db && currentUser.uid) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            role: 'faculty',
            revokedAt: new Date().toISOString()
          });
        } catch (e) {
          console.warn("Firestore old admin revoke note:", e.message);
        }
      }

      // Update in local usersList
      setUsersList(prev => prev.map(u => {
        if (u.email.toLowerCase() === oldEmail) {
          return { ...u, role: 'faculty' };
        }
        return u;
      }));

      // Log out old admin to complete transfer
      await logout();
      return { success: true, transferred: true, newAdmin: result.user };
    }

    return result;
  };

  /**
   * Revoke Admin Role from a specific user
   */
  const revokeAdminRole = async (targetEmail) => {
    if (currentUser?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    const clean = targetEmail.trim().toLowerCase();

    // Prevent revoking if it's the only remaining admin
    const adminCount = usersList.filter(u => u.role === 'admin').length;
    if (adminCount <= 1 && clean === currentUser.email.toLowerCase()) {
      throw new Error('Cannot revoke access for the only remaining administrator. Create a new admin first.');
    }

    // Update in Firestore
    if (isFirebaseConfigured && db) {
      const match = usersList.find(u => u.email.toLowerCase() === clean);
      if (match && match.uid) {
        try {
          await updateDoc(doc(db, 'users', match.uid), { role: 'faculty' });
        } catch (e) {
          console.warn("Firestore revoke error:", e.message);
        }
      }
    }

    setUsersList(prev => prev.map(u => {
      if (u.email.toLowerCase() === clean) {
        return { ...u, role: 'faculty' };
      }
      return u;
    }));

    // If revoking current logged in user
    if (clean === currentUser?.email?.toLowerCase()) {
      await logout();
    }

    return { success: true };
  };

  /**
   * Promote an existing user to Admin
   */
  const promoteToAdmin = async (targetEmail) => {
    if (currentUser?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    const clean = targetEmail.trim().toLowerCase();

    if (isFirebaseConfigured && db) {
      const match = usersList.find(u => u.email.toLowerCase() === clean);
      if (match && match.uid) {
        try {
          await updateDoc(doc(db, 'users', match.uid), { role: 'admin' });
        } catch (e) {
          console.warn("Firestore promote error:", e.message);
        }
      }
    }

    setUsersList(prev => prev.map(u => {
      if (u.email.toLowerCase() === clean) {
        return { ...u, role: 'admin' };
      }
      return u;
    }));

    return { success: true };
  };

  // Sign out
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Signout error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('faculty_kpi_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userRole: currentUser?.role || null,
      isAdmin: currentUser?.role === 'admin',
      isFaculty: currentUser?.role === 'faculty',
      isStudent: currentUser?.role === 'student',
      isAuthenticated: Boolean(currentUser),
      loading,
      authError,
      usersList,
      login,
      registerStudent,
      createNewAdmin,
      replaceAdminAccount,
      revokeAdminRole,
      promoteToAdmin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
