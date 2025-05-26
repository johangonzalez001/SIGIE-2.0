import { Attendance } from '../types';

const MOCK_ATTENDANCE: Attendance[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Juan Pérez',
    subjectId: 1,
    subjectName: 'Matemáticas',
    date: '2024-03-15',
    status: 'present',
    justification: ''
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'María González',
    subjectId: 1,
    subjectName: 'Matemáticas',
    date: '2024-03-15',
    status: 'absent',
    justification: 'Certificado médico'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Pedro Silva',
    subjectId: 1,
    subjectName: 'Matemáticas',
    date: '2024-03-15',
    status: 'late',
    justification: 'Problemas de transporte'
  }
];

export const fetchAttendance = async (): Promise<Attendance[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...MOCK_ATTENDANCE];
};

export const fetchAttendanceById = async (id: number): Promise<Attendance | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_ATTENDANCE.find(record => record.id === id);
};

export const createAttendance = async (attendance: Omit<Attendance, 'id'>): Promise<Attendance> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newAttendance = {
    ...attendance,
    id: MOCK_ATTENDANCE.length + 1
  };
  MOCK_ATTENDANCE.push(newAttendance);
  return newAttendance;
};

export const updateAttendance = async (attendance: Attendance): Promise<Attendance> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = MOCK_ATTENDANCE.findIndex(a => a.id === attendance.id);
  if (index !== -1) {
    MOCK_ATTENDANCE[index] = attendance;
    return attendance;
  }
  throw new Error('Registro de asistencia no encontrado');
};

export const deleteAttendance = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = MOCK_ATTENDANCE.findIndex(record => record.id === id);
  if (index !== -1) {
    MOCK_ATTENDANCE.splice(index, 1);
    return;
  }
  throw new Error('Registro de asistencia no encontrado');
};