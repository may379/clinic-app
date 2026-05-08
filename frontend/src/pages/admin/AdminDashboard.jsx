import React, { useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle, Clock, XCircle, Stethoscope } from 'lucide-react';
import { getDashboardStats } from '../../api/dashboard.api';
import StatCard from '../../components/common/StatCard';
import AppointmentTable from '../../components/common/AppointmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
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
        <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">Real-time clinic statistics and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Patients" value={stats?.totalPatients} icon={Users} color="blue" />
        <StatCard title="Total Doctors" value={stats?.totalDoctors} icon={Stethoscope} color="purple" />
        <StatCard title="Appointments" value={stats?.totalAppointments} icon={Calendar} color="teal" />
        <StatCard title="Pending" value={stats?.pending} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats?.done} icon={CheckCircle} color="green" />
        <StatCard title="Cancelled" value={stats?.cancelled} icon={XCircle} color="red" />
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
        </div>
        <AppointmentTable appointments={stats?.recentAppointments} />
      </div>
    </div>
  );
};

export default AdminDashboard;
