import { Grade } from '../types';

const MOCK_GRADES: Grade[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Juan Pérez',
    subjectId: 1,
    subjectName: 'Matemáticas',
    score: 6.5,
    date: '2024-03-15',
    semester: 1,
    comments: 'Excelente desempeño'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'María González',
    subjectId: 1,
    subjectName: 'Matemáticas',
    score: 5.8,
    date: '2024-03-15',
    semester: 1,
    comments: 'Buen trabajo'
  },
  {
    id: 3,
    studentId: 1,
    studentName: 'Juan Pérez',
    subjectId: 2,
    subjectName: 'Lenguaje',
    score: 7.0,
    date: '2024-03-16',
    semester: 1,
    comments: 'Trabajo sobresaliente'
  }
];

export const fetchGrades = async (): Promise<Grade[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...MOCK_GRADES];
};

export const fetchGradeById = async (id: number): Promise<Grade | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_GRADES.find(grade => grade.id === id);
};

export const createGrade = async (grade: Omit<Grade, 'id'>): Promise<Grade> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newGrade = {
    ...grade,
    id: MOCK_GRADES.length + 1
  };
  MOCK_GRADES.push(newGrade);
  return newGrade;
};

export const updateGrade = async (grade: Grade): Promise<Grade> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = MOCK_GRADES.findIndex(g => g.id === grade.id);
  if (index !== -1) {
    MOCK_GRADES[index] = grade;
    return grade;
  }
  throw new Error('Nota no encontrada');
};

export const deleteGrade = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = MOCK_GRADES.findIndex(grade => grade.id === id);
  if (index !== -1) {
    MOCK_GRADES.splice(index, 1);
    return;
  }
  throw new Error('Nota no encontrada');
};