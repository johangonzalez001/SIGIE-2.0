import { Student } from '../types';
import { api } from '../../shared/utils/api';

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/students');
  return response.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  const response = await api.post('/students', student);
  return response.data;
};

export const updateStudent = async (id: number, student: Partial<Student>): Promise<Student> => {
  const response = await api.put(`/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/students/${id}`);
};