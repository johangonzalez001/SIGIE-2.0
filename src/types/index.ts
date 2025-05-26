// Student Types
export interface Student {
  id: number;
  rut: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'Activo' | 'Egresado' | 'Retirado';
  course_id?: number | null;
  course?: {
    id: number;
    name: string;
    year: number;
    level: string;
    teacher?: {
      id: number;
      first_name: string;
      last_name: string;
      email?: string;
    };
    school?: {
      id: number;
      name: string;
      city?: string;
    };
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Teacher Types
export interface Teacher {
  id: number;
  rut: string;
  first_name: string;
  last_name: string;
  email?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// School Types
export interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  director_name?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Course Types
export interface Course {
  id: number;
  name: string;
  year: number;
  level: string;
  teacher_id?: number;
  teacher?: Teacher;
  school_id: number;
  school?: School;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  subjects?: Subject[];
}

// Subject Types
export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  teacher_id: number;
  teacher?: Teacher;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// CourseSubject Types - Junction table
export interface CourseSubject {
  id: number;
  course_id: number;
  subject_id: number;
  course?: Course;
  subject?: Subject;
  created_at?: string;
}

// Grade Types
export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  score: number;
  date: string;
  semester: number;
  comments: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  justification: string;
}

// Log Types
export interface SystemLog {
  id: number;
  userId: number;
  userName: string;
  userRole: 'administrator' | 'teacher';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW';
  module: 'students' | 'subjects' | 'grades' | 'attendance' | 'users' | 'system';
  description: string;
  timestamp: string;
  ipAddress: string;
  browser: string;
  platform: string;
  details?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: string[];
    additionalInfo?: Record<string, any>;
  };
  severity: 'info' | 'warning' | 'error';
  status: 'success' | 'failure';
}

// Stats Types
export interface EnrollmentStats {
  id: number;
  month: string;
  total_students: number;
  new_enrollments: number;
  withdrawals: number;
  created_at?: string;
}

export interface AttendanceStats {
  id: number;
  date: string;
  present_count: number;
  absent_count: number;
  late_count: number;
  attendance_rate: number;
  created_at?: string;
}

// Dashboard KPI Types
export interface EnrollmentKPI {
  totalStudents: number;
  preBasicRate: number;
  basicRate: number;
  highSchoolRate: number;
  kindergartenCoverage: number;
  enrollmentTrend: Array<{date: string; count: number}>;
}

export interface AttendanceKPI {
  averageAttendanceRate: number;
  dropoutRate: number;
  retentionRate: number;
  attendanceTrend: Array<{date: string; rate: number}>;
}

export interface AcademicKPI {
  averageSimceScore: {
    language: number;
    math: number;
    science: number;
  };
  averagePaesScore: number;
  pisaResults: {
    reading: number;
    math: number;
    science: number;
  };
  simceTrend: Array<{
    year: number;
    language: number;
    math: number;
    science: number;
  }>;
  pisaTrend: Array<{
    year: number;
    reading: number;
    math: number;
    science: number;
  }>;
}

export interface DashboardData {
  enrollment: EnrollmentKPI;
  attendance: AttendanceKPI;
  academic: AcademicKPI;
  years: number[];
  schools: {id: number; name: string}[];
  levels: string[];
}

export interface DashboardFilters {
  year: number;
  schoolId: number | null;
  level: string | null;
  subject: string | null;
}