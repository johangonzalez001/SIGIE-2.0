import { DashboardData } from '../types';

// This would be replaced with actual API calls in a real application
const MOCK_DASHBOARD_DATA: DashboardData = {
  enrollment: {
    totalStudents: 1250,
    preBasicRate: 92.5,
    basicRate: 95.2,
    highSchoolRate: 87.8,
    kindergartenCoverage: 76.4
  },
  attendance: {
    averageAttendanceRate: 89.7,
    dropoutRate: 3.2,
    retentionRate: 96.8
  },
  academic: {
    averageSimceScore: {
      language: 265,
      math: 258,
      science: 270
    },
    averagePaesScore: 625,
    pisaResults: {
      reading: 452,
      math: 423,
      science: 444
    }
  }
};

// Fetch dashboard data
export const fetchDashboardData = async (): Promise<DashboardData> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return MOCK_DASHBOARD_DATA;
};