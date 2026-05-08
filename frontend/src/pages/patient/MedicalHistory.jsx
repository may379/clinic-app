import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointment.api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import { Activity } from 'lucide-react';

const MedicalHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments({ status: 'done' })
      .then(({ data }) => setAppointments(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Medical History</h2>
        <p className="text-sm text-gray-500">{appointments.length} completed visit{appointments.length !== 1 ? 's' : ''}</p>
      </div>

      {appointments.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <Activity size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No completed appointments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{apt.reason}</p>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Dr. {apt.doctor?.name}
                    {apt.doctor?.specialization ? ` — ${apt.doctor.specialization}` : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(apt.date)} at {apt.time}</p>
                  {apt.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">Doctor's notes</p>
                      <p className="text-sm text-gray-700">{apt.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
