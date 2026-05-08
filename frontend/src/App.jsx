import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import PrivateRoute from './components/guards/PrivateRoute';
import RoleRoute from './components/guards/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAppointments from './pages/admin/ManageAppointments';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import MyPatients from './pages/doctor/MyPatients';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalHistory from './pages/patient/MedicalHistory';

import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>

                {/* Admin */}
                <Route element={<RoleRoute roles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/appointments" element={<ManageAppointments />} />
                  <Route path="/admin/notifications" element={<Notifications />} />
                </Route>

                {/* Doctor */}
                <Route element={<RoleRoute roles={['doctor']} />}>
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patients" element={<MyPatients />} />
                  <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                  <Route path="/doctor/notifications" element={<Notifications />} />
                </Route>

                {/* Patient */}
                <Route element={<RoleRoute roles={['patient']} />}>
                  <Route path="/patient" element={<PatientDashboard />} />
                  <Route path="/patient/book" element={<BookAppointment />} />
                  <Route path="/patient/appointments" element={<MyAppointments />} />
                  <Route path="/patient/history" element={<MedicalHistory />} />
                  <Route path="/patient/notifications" element={<Notifications />} />
                </Route>

              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
