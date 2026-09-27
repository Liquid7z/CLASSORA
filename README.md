# CLASSORA

**CLASSORA** is a college/university academic workspace for students, teachers, and administrators.

## Initial Release — v0.8.1

This is the **initial public demonstration release** of CLASSORA. It establishes the responsive interface and the academic-distribution workflow that will later connect to the institution's official API.

### Core Features

- 🎓 Student dashboard and academic workspace
- 👨‍🏫 Teacher dashboard and faculty workspace
- 🛡️ Administrator dashboard and management areas
- 📚 Study materials
- 📅 Exam routines
- 📝 Assignments
- 🧪 Practicals
- 📢 Notices and announcements
- 📆 Events
- 🔎 Global search
- 👤 Profile and settings
- 📊 Administrative reports
- 📱 Responsive layouts for desktop, laptop, tablet, and mobile
- 🎨 Dark, polished academic interface

## Academic Distribution

CLASSORA is built around **academic distribution**, not generic file uploading.

When a teacher sends a material, they select:

1. **What** — Notes, Exam Routine, Assignment, or Practical
2. **Subject** — for example, Data Structures
3. **Semester** — for example, Semester 3
4. **Sections** — one or multiple sections
5. **Title, description, and file**

The material is then mapped to its academic targets. Students see it inside the corresponding subject workspace.

### Example

```text
Teacher
  ↓
Data Structures
  ↓
Notes
  ↓
CSE · Semester 3
  ├── Section A
  ├── Section B
  └── Section E
        ↓
Student → Data Structures → Notes
```

A single uploaded file can therefore be distributed to multiple sections without creating duplicate material records.

## Student Subject Workspace

Each subject can contain:

```text
Data Structures
│
├── 📚 Notes
├── 📅 Exam Routine
├── 📝 Assignments
└── 🧪 Practical
```

Students only receive materials whose academic targets match their department, semester, and section.

## Teacher Workspace

Teachers have access to:

- My Subjects
- Upload Material
- Sent Materials
- Assignment workflow
- Notices
- Events
- Student overview
- Academic information

The **Sent Materials** view shows where each material was distributed.

## Administrator Workspace

The administration interface includes foundations for:

- Student management
- Teacher management
- Administrator management
- Department management
- Course management
- Subject management
- Semester management
- Section management
- Notices
- Events
- Reports
- Settings

## Local Demo Architecture

The current demonstration release uses a **JSON-backed local data layer**. It intentionally does not depend on native SQLite modules, making the demo easier to run with modern Node.js and Next.js environments.

Academic material metadata is stored locally and uploaded demonstration files are kept under `public/uploads/academic/`.

The local data layer is designed to be replaced by the institution's official API when that API becomes available.

## Planned Institutional API Integration

The future API integration can provide authoritative:

- Student records
- Teacher records
- Departments
- Courses
- Subjects
- Semesters
- Sections
- Teacher-subject assignments

CLASSORA can then populate the academic relationships automatically instead of maintaining duplicate institutional records.

## Requirements

- Node.js 20+ recommended
- npm

## Run Locally

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For a production build:

```powershell
npm run build
npm start
```

## Project Structure

```text
app/             Next.js pages and API routes
components/      Shared interface components
lib/             Authentication and academic data layer
data/            Local demo data
public/uploads/  Local academic file storage
```

## Version

**v0.8.1 — Initial Demonstration Release · Academic Distribution**

CLASSORA is currently a demonstration/development release. Institutional authentication, authoritative academic records, production database storage, permissions, and the official college API are intended for the next integration phase.
