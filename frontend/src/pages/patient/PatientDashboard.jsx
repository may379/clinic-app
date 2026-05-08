import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../api/dashboard.api';
import StatCard from '../../components/common/StatCard';
import AppointmentTable from '../../components/common/AppointmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your appointments and health records.</p>
        </div>
        <button onClick={() => navigate('/patient/book')} className="btn-primary">
          + Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={stats?.totalAppointments} icon={Calendar} color="blue" />
        <StatCard title="Pending" value={stats?.pending} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats?.done} icon={CheckCircle} color="green" />
        <StatCard title="Notifications" value={stats?.unreadNotifications} icon={Bell} color="red" />
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
        </div>
        <AppointmentTable
          appointments={stats?.recentAppointments}
          showPatient={false}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;
