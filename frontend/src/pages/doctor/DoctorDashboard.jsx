import React, { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { getDashboardStats } from '../../api/dashboard.api';
import StatCard from '../../components/common/StatCard';
import AppointmentTable from '../../components/common/AppointmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
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
      <div>
        <h2 className="text-xl font-bold text-gray-900">Good day, Dr. {user?.name?.split(' ')[0]}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's your patient and appointment overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Patients" value={stats?.totalPatients} icon={Users} color="blue" />
        <StatCard title="Pending" value={stats?.pending} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats?.done} icon={CheckCircle} color="green" />
        <StatCard title="Unread Alerts" value={stats?.unreadNotifications} icon={Bell} color="red" />
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <AppointmentTable
          appointments={stats?.recentAppointments}
          showDoctor={false}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
