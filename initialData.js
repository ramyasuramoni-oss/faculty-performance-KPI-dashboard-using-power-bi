export const initialKpiWeights = {
  teaching: 0.40,
  research: 0.25,
  feedback: 0.15,
  development: 0.10,
  contribution: 0.10,
};

export const initialFaculty = [
  {
    id: "FAC-101",
    name: "Dr. Ramesh Sharma",
    email: "ramesh.sharma@faculty.edu",
    phone: "+91 98765 43210",
    designation: "Professor & Head of Department",
    department: "Computer Science & Engineering",
    joiningDate: "2018-07-15",
    experience: "16 Years (Teaching & Research)",
    experienceYears: 16,
    qualification: "Ph.D in Distributed Systems, IIT Delhi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Distributed Operating Systems", code: "CS501", program: "B.Tech", branch: "CSE", semester: "Semester 5" },
      { name: "Cloud Architecture", code: "CS702", program: "B.Tech", branch: "CSE", semester: "Semester 7" }
    ],
    teaching: {
      classesAssigned: 60,
      classesConducted: 58,
      studentsTotal: 65,
      studentsPassed: 61,
      attendancePercentage: 92.5
    },
    research: {
      publications: 6,
      conferences: 5,
      patents: 2,
      researchProjects: 3,
      books: 2
    },
    development: {
      certifications: 3,
      workshops: 6,
      fdpAttended: 5
    },
    contribution: {
      committeeWork: 5,
      eventsConducted: 4,
      mentoringActivities: 12
    }
  },
  {
    id: "FAC-102",
    name: "Prof. Ananya Iyer",
    email: "ananya.iyer@faculty.edu",
    phone: "+91 98765 43211",
    designation: "Associate Professor",
    department: "Artificial Intelligence & Data Science",
    joiningDate: "2020-01-10",
    experience: "10 Years (Academic & AI Lab)",
    experienceYears: 10,
    qualification: "M.Tech, Ph.D (Pursuing), IISc Bangalore",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Machine Learning & Neural Networks", code: "AI402", program: "B.Tech", branch: "AI & DS", semester: "Semester 4" },
      { name: "Deep Learning Foundations", code: "AI601", program: "B.Tech", branch: "AI & DS", semester: "Semester 6" }
    ],
    teaching: {
      classesAssigned: 54,
      classesConducted: 52,
      studentsTotal: 60,
      studentsPassed: 57,
      attendancePercentage: 91.0
    },
    research: {
      publications: 4,
      conferences: 4,
      patents: 1,
      researchProjects: 2,
      books: 1
    },
    development: {
      certifications: 4,
      workshops: 5,
      fdpAttended: 4
    },
    contribution: {
      committeeWork: 4,
      eventsConducted: 5,
      mentoringActivities: 9
    }
  },
  {
    id: "FAC-103",
    name: "Dr. Yeshwanth Kumar",
    email: "yeshwanth.kumar@faculty.edu",
    phone: "+91 98765 43212",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    joiningDate: "2021-08-01",
    experience: "8 Years (Full Stack & Cloud)",
    experienceYears: 8,
    qualification: "Ph.D in Software Engineering & Cloud, NIT Trichy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Data Structures & Algorithms", code: "CS301", program: "B.Tech", branch: "CSE", semester: "Semester 3" },
      { name: "Full Stack Web Development", code: "CS503", program: "B.Tech", branch: "CSE", semester: "Semester 5" }
    ],
    teaching: {
      classesAssigned: 56,
      classesConducted: 55,
      studentsTotal: 62,
      studentsPassed: 60,
      attendancePercentage: 95.2
    },
    research: {
      publications: 5,
      conferences: 3,
      patents: 2,
      researchProjects: 3,
      books: 1
    },
    development: {
      certifications: 5,
      workshops: 4,
      fdpAttended: 6
    },
    contribution: {
      committeeWork: 4,
      eventsConducted: 3,
      mentoringActivities: 14
    }
  },
  {
    id: "FAC-104",
    name: "Prof. Rajesh Verma",
    email: "rajesh.verma@faculty.edu",
    phone: "+91 98765 43213",
    designation: "Associate Professor",
    department: "Electronics & Communication Engineering",
    joiningDate: "2019-06-20",
    experience: "12 Years (VLSI & Embedded Systems)",
    experienceYears: 12,
    qualification: "M.Tech in VLSI Systems, IIT Kharagpur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Digital Signal Processing", code: "EC502", program: "B.Tech", branch: "ECE", semester: "Semester 5" },
      { name: "Embedded IoT Architecture", code: "EC701", program: "B.Tech", branch: "ECE", semester: "Semester 7" }
    ],
    teaching: {
      classesAssigned: 50,
      classesConducted: 47,
      studentsTotal: 58,
      studentsPassed: 51,
      attendancePercentage: 86.4
    },
    research: {
      publications: 3,
      conferences: 2,
      patents: 1,
      researchProjects: 1,
      books: 1
    },
    development: {
      certifications: 2,
      workshops: 3,
      fdpAttended: 3
    },
    contribution: {
      committeeWork: 3,
      eventsConducted: 2,
      mentoringActivities: 7
    }
  },
  {
    id: "FAC-105",
    name: "Dr. Priya Nair",
    email: "priya.nair@faculty.edu",
    phone: "+91 98765 43214",
    designation: "Associate Professor",
    department: "Information Technology",
    joiningDate: "2017-11-12",
    experience: "14 Years (Cybersecurity & Networks)",
    experienceYears: 14,
    qualification: "Ph.D in Cyber Security, Anna University",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Network & Cyber Security", code: "IT602", program: "B.Tech", branch: "IT", semester: "Semester 6" },
      { name: "Information Retrieval Systems", code: "IT801", program: "B.Tech", branch: "IT", semester: "Semester 8" }
    ],
    teaching: {
      classesAssigned: 52,
      classesConducted: 51,
      studentsTotal: 64,
      studentsPassed: 62,
      attendancePercentage: 93.8
    },
    research: {
      publications: 5,
      conferences: 4,
      patents: 1,
      researchProjects: 3,
      books: 2
    },
    development: {
      certifications: 3,
      workshops: 5,
      fdpAttended: 4
    },
    contribution: {
      committeeWork: 5,
      eventsConducted: 4,
      mentoringActivities: 11
    }
  },
  {
    id: "FAC-106",
    name: "Prof. Vikram Reddy",
    email: "vikram.reddy@faculty.edu",
    phone: "+91 98765 43215",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    joiningDate: "2022-02-01",
    experience: "6 Years (Robotics & Kinematics)",
    experienceYears: 6,
    qualification: "M.Tech in Robotics & Automation, NIT Warangal",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    assignedSubjects: [
      { name: "Robotics & Kinematics", code: "ME603", program: "B.Tech", branch: "Mechanical", semester: "Semester 6" },
      { name: "Thermodynamics & Heat Transfer", code: "ME401", program: "B.Tech", branch: "Mechanical", semester: "Semester 4" }
    ],
    teaching: {
      classesAssigned: 48,
      classesConducted: 45,
      studentsTotal: 55,
      studentsPassed: 49,
      attendancePercentage: 88.5
    },
    research: {
      publications: 2,
      conferences: 3,
      patents: 0,
      researchProjects: 1,
      books: 0
    },
    development: {
      certifications: 2,
      workshops: 4,
      fdpAttended: 3
    },
    contribution: {
      committeeWork: 3,
      eventsConducted: 3,
      mentoringActivities: 8
    }
  }
];

export const initialAttendanceRecords = [
  {
    id: "ATT-1001",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 5",
    period: "Period 1",
    subject: "Distributed Operating Systems",
    totalStudents: 65,
    present: 60,
    absent: 5,
    time: "09:00 AM - 10:00 AM",
    teacher: "Dr. Ramesh Sharma",
    smsSent: "Yes"
  },
  {
    id: "ATT-1002",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Artificial Intelligence & Data Science",
    semester: "Semester 4",
    period: "Period 2",
    subject: "Machine Learning & Neural Networks",
    totalStudents: 60,
    present: 56,
    absent: 4,
    time: "10:00 AM - 11:00 AM",
    teacher: "Prof. Ananya Iyer",
    smsSent: "Yes"
  },
  {
    id: "ATT-1003",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 3",
    period: "Period 3",
    subject: "Data Structures & Algorithms",
    totalStudents: 62,
    present: 59,
    absent: 3,
    time: "11:15 AM - 12:15 PM",
    teacher: "Dr. Yeshwanth Kumar",
    smsSent: "Yes"
  },
  {
    id: "ATT-1004",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Electronics & Communication Engineering",
    semester: "Semester 5",
    period: "Period 4",
    subject: "Digital Signal Processing",
    totalStudents: 58,
    present: 49,
    absent: 9,
    time: "01:00 PM - 02:00 PM",
    teacher: "Prof. Rajesh Verma",
    smsSent: "Yes"
  },
  {
    id: "ATT-1005",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Information Technology",
    semester: "Semester 6",
    period: "Period 5",
    subject: "Network & Cyber Security",
    totalStudents: 64,
    present: 61,
    absent: 3,
    time: "02:00 PM - 03:00 PM",
    teacher: "Dr. Priya Nair",
    smsSent: "Yes"
  },
  {
    id: "ATT-1006",
    date: "2026-10-16",
    program: "B.Tech",
    branch: "Mechanical Engineering",
    semester: "Semester 6",
    period: "Period 6",
    subject: "Robotics & Kinematics",
    totalStudents: 55,
    present: 48,
    absent: 7,
    time: "03:15 PM - 04:15 PM",
    teacher: "Prof. Vikram Reddy",
    smsSent: "No"
  },
  {
    id: "ATT-1007",
    date: "2026-10-15",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 5",
    period: "Period 2",
    subject: "Full Stack Web Development",
    totalStudents: 62,
    present: 58,
    absent: 4,
    time: "10:00 AM - 11:00 AM",
    teacher: "Dr. Yeshwanth Kumar",
    smsSent: "Yes"
  },
  {
    id: "ATT-1008",
    date: "2026-10-15",
    program: "B.Tech",
    branch: "Artificial Intelligence & Data Science",
    semester: "Semester 6",
    period: "Period 1",
    subject: "Deep Learning Foundations",
    totalStudents: 60,
    present: 54,
    absent: 6,
    time: "09:00 AM - 10:00 AM",
    teacher: "Prof. Ananya Iyer",
    smsSent: "Yes"
  },
  {
    id: "ATT-1009",
    date: "2026-10-15",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 7",
    period: "Period 3",
    subject: "Cloud Architecture",
    totalStudents: 65,
    present: 59,
    absent: 6,
    time: "11:15 AM - 12:15 PM",
    teacher: "Dr. Ramesh Sharma",
    smsSent: "Yes"
  },
  {
    id: "ATT-1010",
    date: "2026-10-14",
    program: "B.Tech",
    branch: "Electronics & Communication Engineering",
    semester: "Semester 7",
    period: "Period 4",
    subject: "Embedded IoT Architecture",
    totalStudents: 58,
    present: 50,
    absent: 8,
    time: "01:00 PM - 02:00 PM",
    teacher: "Prof. Rajesh Verma",
    smsSent: "Yes"
  },
  {
    id: "ATT-1011",
    date: "2026-10-14",
    program: "B.Tech",
    branch: "Information Technology",
    semester: "Semester 8",
    period: "Period 5",
    subject: "Information Retrieval Systems",
    totalStudents: 64,
    present: 60,
    absent: 4,
    time: "02:00 PM - 03:00 PM",
    teacher: "Dr. Priya Nair",
    smsSent: "Yes"
  },
  {
    id: "ATT-1012",
    date: "2026-10-14",
    program: "B.Tech",
    branch: "Mechanical Engineering",
    semester: "Semester 4",
    period: "Period 6",
    subject: "Thermodynamics & Heat Transfer",
    totalStudents: 55,
    present: 47,
    absent: 8,
    time: "03:15 PM - 04:15 PM",
    teacher: "Prof. Vikram Reddy",
    smsSent: "No"
  }
];

export const initialStudents = [
  {
    id: "STU-2026-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@student.edu",
    rollNumber: "21CS045",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 5",
    registrationDate: "2026-08-10",
    status: "Approved",
    attendanceRate: 94.2
  },
  {
    id: "STU-2026-002",
    name: "Sneha Patel",
    email: "sneha.patel@student.edu",
    rollNumber: "21AI012",
    program: "B.Tech",
    branch: "Artificial Intelligence & Data Science",
    semester: "Semester 4",
    registrationDate: "2026-08-11",
    status: "Approved",
    attendanceRate: 92.8
  },
  {
    id: "STU-2026-003",
    name: "Rohan Varma",
    email: "rohan.varma@student.edu",
    rollNumber: "21CS089",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 3",
    registrationDate: "2026-08-12",
    status: "Approved",
    attendanceRate: 96.0
  },
  {
    id: "STU-2026-004",
    name: "Kavya Menon",
    email: "kavya.menon@student.edu",
    rollNumber: "21EC034",
    program: "B.Tech",
    branch: "Electronics & Communication Engineering",
    semester: "Semester 5",
    registrationDate: "2026-09-01",
    status: "Approved",
    attendanceRate: 85.5
  },
  {
    id: "STU-2026-005",
    name: "Aditya Roy",
    email: "aditya.roy@student.edu",
    rollNumber: "22IT018",
    program: "B.Tech",
    branch: "Information Technology",
    semester: "Semester 6",
    registrationDate: "2026-10-14",
    status: "Pending",
    attendanceRate: 91.0
  },
  {
    id: "STU-2026-006",
    name: "Meera Krishnan",
    email: "meera.krishnan@student.edu",
    rollNumber: "22ME009",
    program: "B.Tech",
    branch: "Mechanical Engineering",
    semester: "Semester 4",
    registrationDate: "2026-10-15",
    status: "Pending",
    attendanceRate: 87.5
  }
];

export const initialFeedbacks = [
  {
    id: "FDB-501",
    facultyId: "FAC-101",
    facultyName: "Dr. Ramesh Sharma",
    subject: "Distributed Operating Systems",
    studentRoll: "21CS045",
    studentName: "Aarav Sharma",
    rating: 4.8,
    clarity: 5,
    punctuality: 5,
    knowledge: 5,
    doubtResolution: 4,
    comments: "Exceptional depth in explaining distributed consensus algorithms and RPC protocols. Highly inspiring lectures!",
    date: "2026-10-12"
  },
  {
    id: "FDB-502",
    facultyId: "FAC-102",
    facultyName: "Prof. Ananya Iyer",
    subject: "Machine Learning & Neural Networks",
    studentRoll: "21AI012",
    studentName: "Sneha Patel",
    rating: 4.9,
    clarity: 5,
    punctuality: 5,
    knowledge: 5,
    doubtResolution: 5,
    comments: "Practical coding labs with PyTorch and step-by-step mathematical intuitions made complex gradient descent super clear.",
    date: "2026-10-11"
  },
  {
    id: "FDB-503",
    facultyId: "FAC-103",
    facultyName: "Dr. Yeshwanth Kumar",
    subject: "Data Structures & Algorithms",
    studentRoll: "21CS089",
    studentName: "Rohan Varma",
    rating: 4.95,
    clarity: 5,
    punctuality: 5,
    knowledge: 5,
    doubtResolution: 5,
    comments: "Brilliant explanation of dynamic programming and graph theory! Very approachable and always available to solve coding doubts.",
    date: "2026-10-14"
  },
  {
    id: "FDB-504",
    facultyId: "FAC-104",
    facultyName: "Prof. Rajesh Verma",
    subject: "Digital Signal Processing",
    studentRoll: "21EC034",
    studentName: "Kavya Menon",
    rating: 4.1,
    clarity: 4,
    punctuality: 4,
    knowledge: 5,
    doubtResolution: 3.5,
    comments: "Strong conceptual understanding, but the pacing for Fourier transforms could be slightly slower to allow for practice problems.",
    date: "2026-10-09"
  },
  {
    id: "FDB-505",
    facultyId: "FAC-105",
    facultyName: "Dr. Priya Nair",
    subject: "Network & Cyber Security",
    studentRoll: "22IT018",
    studentName: "Aditya Roy",
    rating: 4.7,
    clarity: 5,
    punctuality: 4.8,
    knowledge: 5,
    doubtResolution: 4.5,
    comments: "Realistic penetration testing demos and Wireshark traffic analysis sessions are engaging and industry-relevant.",
    date: "2026-10-13"
  },
  {
    id: "FDB-506",
    facultyId: "FAC-106",
    facultyName: "Prof. Vikram Reddy",
    subject: "Robotics & Kinematics",
    studentRoll: "22ME009",
    studentName: "Meera Krishnan",
    rating: 4.2,
    clarity: 4,
    punctuality: 4.5,
    knowledge: 4.5,
    doubtResolution: 4,
    comments: "Good hands-on robotic arm simulations, would love more time allocated to kinematic matrix calculations.",
    date: "2026-10-08"
  }
];

export const defaultPowerBiConfig = {
  embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiMDYyNGE0NjktZDVkNy00N2EzLWExYmEtZDMyNWRjODJjZjY2IiwidCI6ImM2ZTU0OWIzLTVmNDUtNDAzMi1hYWU5LWQ0MjNkNmZlZTcwNyIsImMiOjN9",
  reportName: "Faculty Performance & Daily Attendance Analytics",
  lastRefreshed: "2026-10-16 12:30 PM",
  autoRefreshMinutes: 15,
  showSampleFallback: true
};
