
import api from './axiosInstance';

export const getAppointments = (params) =>
  api.get('/api/appointments', { params });

export const getAppointment = (id) =>
  api.get(`/api/appointments/${id}`);

export const createAppointment = (data) =>
  api.post('/api/appointments', data);

export const updateAppointment = (id, data) =>
  api.put(`/api/appointments/${id}`, data);

export const cancelAppointment = (id) =>
  api.patch(`/api/appointments/${id}/cancel`);

export const deleteAppointment = (id) =>
  api.delete(`/api/appointments/${id}`);