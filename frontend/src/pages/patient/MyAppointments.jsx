import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, cancelAppointment } from '../../api/appointment.api';
import AppointmentTable from '../../components/common/AppointmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await getAppointments({ status: statusFilter });
      setAppointments(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAction = async (key, apt) => {
    if (key === 'cancel') {
      if (!confirm('Cancel this appointment?')) return;
      try {
        await cancelAppointment(apt._id);
        fetchAppointments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const tableActions = [
    {
      key: 'cancel',
      label: 'Cancel',
      variant: 'danger',
      disabled: (apt) => apt.status !== 'pending',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
        <div className="flex gap-2">
          <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={() => navigate('/patient/book')} className="btn-primary">
            + Book New
          </button>
        </div>
      </div>

      <div className="card">
        <AppointmentTable
          appointments={appointments}
          showPatient={false}
          onAction={handleAction}
          actions={tableActions}
        />
      </div>
    </div>
  );
};

export default MyAppointments;
