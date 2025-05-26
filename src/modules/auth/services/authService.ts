import { LoginCredentials, User } from '../types';

// Mock authentication service implementation
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Implementation remains the same
};

export const logout = async (): Promise<void> => {
  // Implementation remains the same
};