/**
 * Mock domain data for the Aarth Educator UI.
 * Indian K-12: grades 8-12, boards CBSE/NCERT + Karnataka State (KTBS),
 * streams for class 11/12, NCERT subjects, Indian names, en-IN formatting.
 * Swap these modules for real queries when porting into production.
 */

export type Board = "NCERT" | "Karnataka State";
export type Stream = "Science" | "Commerce" | "Arts";

export const INSTITUTION = {
  name: "Sringeri Vidya Mandir",
  short: "Sringeri",
  area: "Jayanagar Campus",
  city: "Bengaluru",
  state: "Karnataka",
  logoInitials: "SV",
  plan: "Essential",
};

export type ClassRecord = {
  id: string;
  name: string;
  grade: number;
  board: Board;
  stream?: Stream;
  academicYear: string;
  term: string;
  description: string;
  subjectCount: number;
  studentCount: number;
  teacherCount: number;
  archived?: boolean;
};

export const classes: ClassRecord[] = [
  {
    id: "c8a",
    name: "Class 8 — A",
    grade: 8,
    board: "NCERT",
    academicYear: "2026–27",
    term: "Term 1",
    description: "Middle school core batch, morning shift.",
    subjectCount: 6,
    studentCount: 42,
    teacherCount: 5,
  },
  {
    id: "c9b",
    name: "Class 9 — B",
    grade: 9,
    board: "NCERT",
    academicYear: "2026–27",
    term: "Term 1",
    description: "Focus batch with additional Mathematics support.",
    subjectCount: 6,
    studentCount: 38,
    teacherCount: 6,
  },
  {
    id: "c10a",
    name: "Class 10 — A",
    grade: 10,
    board: "Karnataka State",
    academicYear: "2026–27",
    term: "Term 1",
    description: "KTBS board batch preparing for SSLC.",
    subjectCount: 6,
    studentCount: 45,
    teacherCount: 6,
  },
  {
    id: "c11s",
    name: "Class 11 — Science",
    grade: 11,
    board: "NCERT",
    stream: "Science",
    academicYear: "2026–27",
    term: "Term 1",
    description: "PCMB stream with weekly practicals.",
    subjectCount: 5,
    studentCount: 34,
    teacherCount: 5,
  },
  {
    id: "c12c",
    name: "Class 12 — Commerce",
    grade: 12,
    board: "NCERT",
    stream: "Commerce",
    academicYear: "2026–27",
    term: "Term 2",
    description: "Accountancy, Business Studies and Economics.",
    subjectCount: 5,
    studentCount: 29,
    teacherCount: 4,
  },
  {
    id: "c10b-arch",
    name: "Class 10 — B",
    grade: 10,
    board: "Karnataka State",
    academicYear: "2025–26",
    term: "Term 3",
    description: "Archived after the 2025–26 session.",
    subjectCount: 6,
    studentCount: 41,
    teacherCount: 5,
    archived: true,
  },
];

export const academicYears = ["2026–27", "2025–26", "2024–25"];
export const currentAcademicYear = "2026–27";

export type SubjectRecord = {
  id: string;
  classId: string;
  name: string;
  description: string;
  moduleCount: number;
  fileCount: number;
};

export const subjects: SubjectRecord[] = [
  {
    id: "s1",
    classId: "c8a",
    name: "Science",
    description: "NCERT Science — Crop production to light.",
    moduleCount: 8,
    fileCount: 12,
  },
  {
    id: "s2",
    classId: "c8a",
    name: "Mathematics",
    description: "Rational numbers, algebra, mensuration.",
    moduleCount: 7,
    fileCount: 9,
  },
  {
    id: "s3",
    classId: "c8a",
    name: "Social Science",
    description: "History, geography and civics.",
    moduleCount: 6,
    fileCount: 4,
  },
  {
    id: "s4",
    classId: "c9b",
    name: "Science",
    description: "Matter, tissues, motion and gravitation.",
    moduleCount: 9,
    fileCount: 14,
  },
  {
    id: "s5",
    classId: "c9b",
    name: "Mathematics",
    description: "Number systems, polynomials, geometry.",
    moduleCount: 8,
    fileCount: 6,
  },
  {
    id: "s6",
    classId: "c10a",
    name: "Science",
    description: "KTBS Science — chemical reactions to heredity.",
    moduleCount: 10,
    fileCount: 18,
  },
  {
    id: "s7",
    classId: "c10a",
    name: "Kannada",
    description: "Prose, poetry and grammar.",
    moduleCount: 5,
    fileCount: 3,
  },
  {
    id: "s8",
    classId: "c11s",
    name: "Physics",
    description: "Units, kinematics, laws of motion.",
    moduleCount: 9,
    fileCount: 11,
  },
  {
    id: "s9",
    classId: "c11s",
    name: "Chemistry",
    description: "Structure of atom, bonding, thermodynamics.",
    moduleCount: 8,
    fileCount: 7,
  },
  {
    id: "s10",
    classId: "c11s",
    name: "Biology",
    description: "Living world, cell, plant physiology.",
    moduleCount: 7,
    fileCount: 5,
  },
  {
    id: "s11",
    classId: "c12c",
    name: "Accountancy",
    description: "Partnership accounts and company accounts.",
    moduleCount: 6,
    fileCount: 8,
  },
  {
    id: "s12",
    classId: "c12c",
    name: "Business Studies",
    description: "Management principles and business finance.",
    moduleCount: 6,
    fileCount: 4,
  },
];

export type ModuleRecord = {
  id: string;
  subjectId: string;
  index: number;
  name: string;
  description: string;
  noteCount: number;
};

export const modules: ModuleRecord[] = [
  {
    id: "m1",
    subjectId: "s8",
    index: 1,
    name: "Physical World & Measurement",
    description: "Units, dimensions, significant figures.",
    noteCount: 4,
  },
  {
    id: "m2",
    subjectId: "s8",
    index: 2,
    name: "Kinematics",
    description: "Motion in a straight line and in a plane.",
    noteCount: 6,
  },
  {
    id: "m3",
    subjectId: "s8",
    index: 3,
    name: "Laws of Motion",
    description: "Newton's laws, friction, circular motion.",
    noteCount: 5,
  },
  {
    id: "m4",
    subjectId: "s8",
    index: 4,
    name: "Work, Energy & Power",
    description: "Work-energy theorem and collisions.",
    noteCount: 3,
  },
  {
    id: "m5",
    subjectId: "s8",
    index: 5,
    name: "Gravitation",
    description: "Kepler's laws, orbital motion, satellites.",
    noteCount: 2,
  },
];

export type StudentRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  rollNumber: string;
  invited?: boolean;
  subjects: string[];
};

export const students: StudentRecord[] = [
  {
    id: "st1",
    name: "Aditi Rao",
    email: "aditi.rao@student.sringeri.edu.in",
    phone: "+91 98450 11234",
    classId: "c11s",
    rollNumber: "11S-04",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
  },
  {
    id: "st2",
    name: "Rohan Deshpande",
    email: "rohan.deshpande@student.sringeri.edu.in",
    phone: "+91 98860 55112",
    classId: "c11s",
    rollNumber: "11S-11",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "st3",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@student.sringeri.edu.in",
    phone: "+91 99001 42277",
    classId: "c10a",
    rollNumber: "10A-19",
    invited: true,
    subjects: ["Science", "Mathematics", "Kannada"],
  },
  {
    id: "st4",
    name: "Karthik Nair",
    email: "karthik.nair@student.sringeri.edu.in",
    phone: "+91 97400 88190",
    classId: "c10a",
    rollNumber: "10A-27",
    subjects: ["Science", "Mathematics", "Social Science"],
  },
  {
    id: "st5",
    name: "Meera Joshi",
    email: "meera.joshi@student.sringeri.edu.in",
    phone: "+91 99640 33017",
    classId: "c9b",
    rollNumber: "9B-08",
    subjects: ["Science", "Mathematics", "English"],
  },
  {
    id: "st6",
    name: "Imran Sheikh",
    email: "imran.sheikh@student.sringeri.edu.in",
    phone: "+91 90080 71265",
    classId: "c9b",
    rollNumber: "9B-15",
    invited: true,
    subjects: ["Science", "Mathematics", "Hindi"],
  },
  {
    id: "st7",
    name: "Divya Shetty",
    email: "divya.shetty@student.sringeri.edu.in",
    phone: "+91 98452 90011",
    classId: "c8a",
    rollNumber: "8A-02",
    subjects: ["Science", "Mathematics", "Social Science"],
  },
  {
    id: "st8",
    name: "Aryan Gowda",
    email: "aryan.gowda@student.sringeri.edu.in",
    phone: "+91 99720 45560",
    classId: "c12c",
    rollNumber: "12C-06",
    subjects: ["Accountancy", "Business Studies", "Economics"],
  },
];

export type TeacherRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  specializations: string[];
  classIds: string[];
};

export const teachers: TeacherRecord[] = [
  {
    id: "t1",
    name: "Ananya Krishnan",
    email: "ananya.krishnan@sringeri.edu.in",
    phone: "+91 98451 20034",
    title: "Senior Faculty",
    department: "Science",
    specializations: ["Physics", "Chemistry"],
    classIds: ["c11s", "c10a"],
  },
  {
    id: "t2",
    name: "Vikram Patil",
    email: "vikram.patil@sringeri.edu.in",
    phone: "+91 98800 71190",
    title: "Faculty",
    department: "Mathematics",
    specializations: ["Mathematics"],
    classIds: ["c9b", "c10a", "c11s"],
  },
  {
    id: "t3",
    name: "Lakshmi Narayan",
    email: "lakshmi.narayan@sringeri.edu.in",
    phone: "+91 99450 22871",
    title: "Faculty",
    department: "Languages",
    specializations: ["Kannada", "Hindi"],
    classIds: ["c8a", "c10a"],
  },
  {
    id: "t4",
    name: "Farhan Qureshi",
    email: "farhan.qureshi@sringeri.edu.in",
    phone: "+91 97310 55402",
    title: "Faculty",
    department: "Commerce",
    specializations: ["Accountancy", "Business Studies"],
    classIds: ["c12c"],
  },
  {
    id: "t5",
    name: "Sunita Bhat",
    email: "sunita.bhat@sringeri.edu.in",
    phone: "+91 90190 61123",
    title: "Faculty",
    department: "Social Science",
    specializations: ["History", "Civics"],
    classIds: ["c8a", "c9b"],
  },
];

export type DocRecord = {
  id: string;
  title: string;
  template: "blank" | "question_paper" | "study_material" | "lesson_plan" | "report";
  classId: string;
  subject: string;
  updatedAt: string;
  pinned?: boolean;
};

export const aiDocuments: DocRecord[] = [
  {
    id: "d1",
    title: "Laws of Motion — Study Notes",
    template: "study_material",
    classId: "c11s",
    subject: "Physics",
    updatedAt: "2026-09-03T10:20:00+05:30",
    pinned: true,
  },
  {
    id: "d2",
    title: "Chemical Reactions — Chapter Summary",
    template: "study_material",
    classId: "c10a",
    subject: "Science",
    updatedAt: "2026-09-02T16:05:00+05:30",
  },
  {
    id: "d3",
    title: "Mid-term Question Paper (Physics)",
    template: "question_paper",
    classId: "c11s",
    subject: "Physics",
    updatedAt: "2026-09-01T09:40:00+05:30",
  },
  {
    id: "d4",
    title: "Gravitation — Lesson Plan",
    template: "lesson_plan",
    classId: "c11s",
    subject: "Physics",
    updatedAt: "2026-08-29T14:15:00+05:30",
  },
  {
    id: "d5",
    title: "Term 1 Progress Report Draft",
    template: "report",
    classId: "c10a",
    subject: "Science",
    updatedAt: "2026-08-27T11:00:00+05:30",
  },
];

export type QuizRecord = {
  id: string;
  title: string;
  classId: string;
  subject: string;
  questions: number;
  marks: number;
  duration: number;
  status: "draft" | "published" | "closed";
  shareCode?: string;
  responses?: number;
};

export const quizzes: QuizRecord[] = [
  {
    id: "q1",
    title: "Kinematics Quick Test",
    classId: "c11s",
    subject: "Physics",
    questions: 15,
    marks: 30,
    duration: 25,
    status: "published",
    shareCode: "PHY-7K42",
    responses: 28,
  },
  {
    id: "q2",
    title: "Chemical Reactions — Recap",
    classId: "c10a",
    subject: "Science",
    questions: 10,
    marks: 20,
    duration: 15,
    status: "closed",
    shareCode: "SCI-2M18",
    responses: 44,
  },
  {
    id: "q3",
    title: "Polynomials Practice",
    classId: "c9b",
    subject: "Mathematics",
    questions: 12,
    marks: 24,
    duration: 20,
    status: "draft",
  },
];

export type PaperRecord = {
  id: string;
  title: string;
  classId: string;
  subject: string;
  board: Board;
  marks: number;
  duration: number;
  status: "draft" | "published" | "closed";
  createdAt: string;
};

export const papers: PaperRecord[] = [
  {
    id: "p1",
    title: "Physics Mid-term — Class 11 Science",
    classId: "c11s",
    subject: "Physics",
    board: "NCERT",
    marks: 70,
    duration: 180,
    status: "published",
    createdAt: "2026-08-30T09:00:00+05:30",
  },
  {
    id: "p2",
    title: "Science Unit Test 2 — Class 10",
    classId: "c10a",
    subject: "Science",
    board: "Karnataka State",
    marks: 40,
    duration: 90,
    status: "draft",
    createdAt: "2026-08-24T15:30:00+05:30",
  },
];

export type DeckRecord = {
  id: string;
  title: string;
  classId: string;
  subject: string;
  slides: number;
  updatedAt: string;
};

export const presentations: DeckRecord[] = [
  {
    id: "pr1",
    title: "Laws of Motion — Class Deck",
    classId: "c11s",
    subject: "Physics",
    slides: 14,
    updatedAt: "2026-09-03T08:30:00+05:30",
  },
  {
    id: "pr2",
    title: "Tissues — Visual Walkthrough",
    classId: "c9b",
    subject: "Science",
    slides: 11,
    updatedAt: "2026-08-28T17:10:00+05:30",
  },
];

export type FileRecord = {
  id: string;
  name: string;
  subjectId: string;
  size: string;
  uploadedAt: string;
  shared?: boolean;
};

export const libraryFiles: FileRecord[] = [
  {
    id: "f1",
    name: "Laws of Motion — worksheet.pdf",
    subjectId: "s8",
    size: "412 KB",
    uploadedAt: "2026-09-02T12:00:00+05:30",
    shared: true,
  },
  {
    id: "f2",
    name: "Kinematics graphs.pdf",
    subjectId: "s8",
    size: "1.1 MB",
    uploadedAt: "2026-08-30T10:20:00+05:30",
  },
  {
    id: "f3",
    name: "Chemical reactions lab sheet.pdf",
    subjectId: "s6",
    size: "780 KB",
    uploadedAt: "2026-08-26T09:15:00+05:30",
    shared: true,
  },
  {
    id: "f4",
    name: "Polynomials extra sums.docx",
    subjectId: "s5",
    size: "96 KB",
    uploadedAt: "2026-08-22T18:40:00+05:30",
  },
];

export type TextbookRecord = {
  id: string;
  title: string;
  board: Board;
  grade: number;
  subject: string;
  inLibrary?: boolean;
};

export const textbooks: TextbookRecord[] = [
  { id: "b1", title: "Science — Class 8", board: "NCERT", grade: 8, subject: "Science", inLibrary: true },
  { id: "b2", title: "Mathematics — Class 8", board: "NCERT", grade: 8, subject: "Mathematics" },
  { id: "b3", title: "Science — Class 9", board: "NCERT", grade: 9, subject: "Science" },
  { id: "b4", title: "Mathematics — Class 10", board: "NCERT", grade: 10, subject: "Mathematics", inLibrary: true },
  { id: "b5", title: "Science — Class 10 (KTBS)", board: "Karnataka State", grade: 10, subject: "Science" },
  { id: "b6", title: "Kannada — Class 10 (KTBS)", board: "Karnataka State", grade: 10, subject: "Kannada" },
  { id: "b7", title: "Physics Part I — Class 11", board: "NCERT", grade: 11, subject: "Physics", inLibrary: true },
  { id: "b8", title: "Chemistry Part I — Class 11", board: "NCERT", grade: 11, subject: "Chemistry" },
  { id: "b9", title: "Biology — Class 11", board: "NCERT", grade: 11, subject: "Biology" },
  { id: "b10", title: "Accountancy Part I — Class 12", board: "NCERT", grade: 12, subject: "Accountancy" },
  { id: "b11", title: "Business Studies — Class 12", board: "NCERT", grade: 12, subject: "Business Studies" },
  { id: "b12", title: "Social Science — Class 9 (KTBS)", board: "Karnataka State", grade: 9, subject: "Social Science" },
];

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  classId: string;
  room: string;
};

export const todaySchedule: ScheduleItem[] = [
  { id: "sc1", time: "09:15", title: "Physics — Laws of Motion", classId: "c11s", room: "Lab 2" },
  { id: "sc2", time: "10:30", title: "Science — Chemical Reactions", classId: "c10a", room: "Room 14" },
  { id: "sc3", time: "12:00", title: "Physics practical", classId: "c11s", room: "Lab 2" },
  { id: "sc4", time: "14:15", title: "Mentoring hour", classId: "c10a", room: "Room 14" },
];

export type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  kind: "assignment" | "test";
  classId: string;
};

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", day: 4, title: "Physics unit test", kind: "test", classId: "c11s" },
  { id: "e2", day: 8, title: "Science worksheet due", kind: "assignment", classId: "c10a" },
  { id: "e3", day: 12, title: "Chemistry surprise test", kind: "test", classId: "c11s" },
  { id: "e4", day: 17, title: "Lab report submission", kind: "assignment", classId: "c11s" },
  { id: "e5", day: 21, title: "Maths revision test", kind: "test", classId: "c9b" },
  { id: "e6", day: 25, title: "Project checkpoint", kind: "assignment", classId: "c10a" },
];

export type PlanRecord = {
  classId: string;
  name: string;
  plannedSubjects: number;
  totalSubjects: number;
  doneChapters: number;
  totalChapters: number;
  termStart: string;
  termEnd: string;
  daysLeft: number;
};

export const plans: PlanRecord[] = [
  {
    classId: "c11s",
    name: "Class 11 — Science",
    plannedSubjects: 3,
    totalSubjects: 5,
    doneChapters: 11,
    totalChapters: 32,
    termStart: "2026-06-10",
    termEnd: "2026-10-30",
    daysLeft: 56,
  },
  {
    classId: "c10a",
    name: "Class 10 — A",
    plannedSubjects: 5,
    totalSubjects: 6,
    doneChapters: 18,
    totalChapters: 40,
    termStart: "2026-06-02",
    termEnd: "2026-10-15",
    daysLeft: 41,
  },
];

export type ChapterRecord = {
  id: string;
  index: number;
  name: string;
  status: "pending" | "in_progress" | "done";
  plannedStart: string;
  weeks: number;
};

export const chapters: ChapterRecord[] = [
  { id: "ch1", index: 1, name: "Physical World & Measurement", status: "done", plannedStart: "2026-06-10", weeks: 2 },
  { id: "ch2", index: 2, name: "Kinematics", status: "done", plannedStart: "2026-06-24", weeks: 3 },
  { id: "ch3", index: 3, name: "Laws of Motion", status: "in_progress", plannedStart: "2026-07-15", weeks: 3 },
  { id: "ch4", index: 4, name: "Work, Energy & Power", status: "pending", plannedStart: "2026-08-05", weeks: 2 },
  { id: "ch5", index: 5, name: "Gravitation", status: "pending", plannedStart: "2026-08-19", weeks: 2 },
  { id: "ch6", index: 6, name: "Thermodynamics", status: "pending", plannedStart: "2026-09-02", weeks: 3 },
];

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "important" | "urgent";
  sentAt: string;
  read: boolean;
};

export const notifications: NotificationRecord[] = [
  {
    id: "n1",
    title: "Term 1 marks entry closes Friday",
    message: "Please complete internal assessment entry for all assigned classes before 6 PM IST.",
    priority: "urgent",
    sentAt: "2026-09-04T09:10:00+05:30",
    read: false,
  },
  {
    id: "n2",
    title: "Faculty meeting — Saturday 10 AM",
    message: "Agenda: curriculum pacing review and board exam readiness.",
    priority: "important",
    sentAt: "2026-09-03T17:45:00+05:30",
    read: false,
  },
  {
    id: "n3",
    title: "New NCERT textbooks added to library",
    message: "Class 11 Physics Part II and Chemistry Part II are now importable.",
    priority: "normal",
    sentAt: "2026-09-01T11:30:00+05:30",
    read: true,
  },
];

export type TicketRecord = {
  id: string;
  subject: string;
  type: "Bug" | "Question" | "Feature" | "Account" | "Content";
  priority: "Low" | "Medium" | "High";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

export const tickets: TicketRecord[] = [
  {
    id: "tk1",
    subject: "Quiz share code not accepted by two students",
    type: "Bug",
    priority: "High",
    status: "in_progress",
    createdAt: "2026-09-02T13:20:00+05:30",
  },
  {
    id: "tk2",
    subject: "Can I export a question paper to Word?",
    type: "Question",
    priority: "Low",
    status: "resolved",
    createdAt: "2026-08-25T10:05:00+05:30",
  },
];

export const NCERT_SUBJECT_SUGGESTIONS = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "English",
  "Hindi",
  "Kannada",
  "Accountancy",
  "Business Studies",
  "Economics",
  "Computer Science",
];

/* ---------- helpers ---------- */

export function classById(id: string) {
  return classes.find((c) => c.id === id);
}

export function subjectsForClass(id: string) {
  return subjects.filter((s) => s.classId === id);
}

export function studentsForClass(id: string) {
  return students.filter((s) => s.classId === id);
}

export function teachersForClass(id: string) {
  return teachers.filter((t) => t.classIds.includes(id));
}

export function className(id: string) {
  return classById(id)?.name ?? "Unassigned";
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const now = new Date("2026-09-04T17:28:00+05:30").getTime();
  const diff = now - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function greeting(hour = 17) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const todayLabel = new Date("2026-09-04T17:28:00+05:30").toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
