
import api from './axiosInstance';

export const getDashboardStats = () =>
  api.get('/api/dashboard');