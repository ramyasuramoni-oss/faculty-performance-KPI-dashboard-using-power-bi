# 📊 Faculty KPI & Daily Attendance Portal

An institutional Faculty Performance Evaluation and Attendance Analytics Dashboard integrated with **Microsoft Power BI** and **Firebase Authentication & Firestore**.

Built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Key Features & Portals

### 1. 🛡️ Admin Portal (Full Management Authority)
- **Restricted Access**: Only authorized administrators can log in.
- **Attendance Management (Full CRUD)**:
  - Add individual attendance records.
  - Edit existing records (updates present/absent headcounts, periods, subjects).
  - Delete records.
  - **Bulk Import**: Drag-and-drop Excel (`.xlsx`, `.xls`) or CSV files with live preview before importing.
  - Download pre-formatted sample CSV templates.
  - Export data to **Excel (.xlsx)**, **CSV**, or formatted **Print/PDF**.
- **Student Registration Management**:
  - Review all new student registrations with real-time "Pending" status alerts.
  - One-click **Approve**, **Reject**, or **Delete** actions.
- **Institutional KPI Scoring Weights Configuration**:
  - Live adjustment sliders for all five performance pillars:
    - Teaching Score (Default 40%)
    - Research Output (Default 25%)
    - Student Feedback (Default 15%)
    - Professional Development (Default 10%)
    - Departmental Contribution (Default 10%)
- **Power BI Embedded Report Configuration**:
  - Switch or update Power BI report embed URLs live from within the portal.

---

### 2. 👨‍🏫 Faculty Portal (Read-Only)
- **Profile Card**: Displays Designation, Department, Academic Qualifications, Tenure Joining Date, and Contact Information.
- **Assigned Courses**: Lists assigned subjects, course codes, program, branch, and semester allocations.
- **Performance Evaluation Matrix**:
  - Overall Composite KPI Score (Grade A+, A, B, etc.).
  - Teaching Score (Class completion rate, Pass percentage, Attendance average).
  - Research Portfolio (Publications, Conferences, Patents, Funded Projects, Books).
  - Professional Development (Certifications, Workshops, FDPs).
  - Departmental Contributions (Committees, Events, Mentoring).
- **Personalized Attendance History**:
  - Strictly displays attendance logs and SMS alert statuses for classes taught by this faculty member.
  - **Strict Read-Only Enforcement**: No edit, delete, or modify permissions.
- **Student Feedback Stream**:
  - Real-time rating (out of 5.0 stars) and constructive qualitative reviews submitted by enrolled students.

---

### 3. 🎓 Student Portal
- **Student Registration & Authentication**:
  - Self-service enrollment form (Name, Roll Number / USN, Email, Program, Branch, Semester, Password).
  - Registrations automatically populate the Admin Portal for administrative verification.
- **Faculty Directory**:
  - Browse all faculty profiles across departments, review their qualifications, designations, and courses taught.
- **Submit Faculty Feedback**:
  - Multi-criteria star rating (1 to 5 stars) across:
    - Overall Teaching Effectiveness
    - Concept Clarity & Presentation
    - Punctuality & Syllabus Pace
    - Doubt Resolution & Mentoring Availability
  - Qualitative comments and feedback.
  - Real-time updates directly recalibrate faculty KPI rankings.
- **Permitted Academic Information**:
  - Branch-wise daily class attendance records, periods, timings, and SMS alert dispatch logs.

---

## 📈 Dashboard Data Fields

Every attendance entry includes:
| Field | Description | Example |
| :--- | :--- | :--- |
| **Program** | Academic program | B.Tech, M.Tech, MCA, MBA |
| **Branch** | Engineering / department branch | Computer Science & Engineering |
| **Semester** | Current academic semester | Semester 5 |
| **Period** | Daily timetable period | Period 1 to Period 6 |
| **Subject** | Course title | Distributed Operating Systems |
| **Total Students**| Total registered students in batch | 65 |
| **Present** | Number of students present | 60 |
| **Absent** | Number of absent students | 5 |
| **Time** | Scheduled time slot | 09:00 AM - 10:00 AM |
| **Teacher** | Assigned faculty name | Dr. Ramesh Sharma |
| **SMS Sent** | Guardian absence SMS status | Yes / No / Delivered |
| **Attendance %**| Calculated presence percentage | 92% |

---

## ⚡ Default Demo Credentials

One-click demo login buttons are provided on the login page for instant access:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@facultykpi.edu` | `Admin@123` |
| **Faculty** | `ramesh.sharma@faculty.edu` | `Faculty@123` |
| **Student** | `aarav.sharma@student.edu` | `Student@123` |

---

## 🛠️ Local Development Setup

1. **Install Dependencies**:
   ```powershell
   npm install
   ```

2. **Start Local Development Server**:
   ```powershell
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```powershell
   npm run build
   ```

---

## 🔥 Firebase Setup (Authentication & Firestore)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** -> **Email/Password sign-in provider**.
3. Enable **Cloud Firestore** in test mode or production mode.
4. Copy the security rules from `firestore.rules` into your Firestore Rules tab.
5. In **Project Settings** -> **General**, create a **Web App** (`</>`) and copy the configuration credentials into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_ADMIN_EMAIL=admin@facultykpi.edu
   ```
> *Note: If Firebase credentials are not yet entered, the app gracefully operates in Local Storage / Persistence mode with full sample data and zero crashes.*

---

## 🌐 Deploy to Vercel & Push to GitHub

### Step 1: Initialize & Push to GitHub
```powershell
git init
git add .
git commit -m "Initial commit: Complete Faculty KPI & Attendance Portal with Power BI integration"
git branch -M main
git remote add origin https://github.com/yeshwanthkumaryk/faculty-kpi-portal.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your `faculty-kpi-portal` repository.
4. Framework Preset: **Vite** (automatically detected).
5. Add Environment Variables from `.env` in the Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL`
6. Click **"Deploy"**. Your application is live within seconds!

---

## 📊 Power BI Desktop Integration

A ready-to-use sample dataset is included in the project:
`PowerBI_Faculty_KPI_Attendance_Sample_Data.csv`

To connect in Power BI Desktop:
1. Open **Microsoft Power BI Desktop**.
2. Click **Get Data** -> **Text/CSV**.
3. Select `PowerBI_Faculty_KPI_Attendance_Sample_Data.csv` from this project folder.
4. Click **Load** and design your interactive visuals.
5. Click **Publish** to publish the report to the Power BI Service.
6. In Power BI Service, click **File** -> **Embed Report** -> **Publish to Web (Public)** or **Embed in Website or Portal**.
7. Copy the embed URL and paste it in the **Admin Portal** or **Power BI Embed Config** modal.
