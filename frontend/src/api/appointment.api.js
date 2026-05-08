import api from './axiosInstance';

export const getAppointments = (params) => api.get('/appointments', { params });
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const cancelAppointment = (id) => api.patch(`/appointments/${id}/cancel`);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
