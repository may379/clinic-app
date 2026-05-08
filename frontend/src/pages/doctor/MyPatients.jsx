import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, Calendar } from 'lucide-react';
import { getAppointments } from '../../api/appointment.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments()
      .then(({ data }) => {
        // Deduplicate patients from appointments
        const seen = new Set();
        const unique = [];
        data.data.forEach((apt) => {
          if (apt.patient && !seen.has(apt.patient._id)) {
            seen.add(apt.patient._id);
            unique.push({
              ...apt.patient,
              lastVisit: apt.date,
              lastReason: apt.reason,
            });
          }
        });
        setPatients(unique);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">My Patients</h2>
        <p className="text-sm text-gray-500">{patients.length} patient{patients.length !== 1 ? 's' : ''} assigned</p>
      </div>

      {patients.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <User size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No patients yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <div key={patient._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{patient.gender || 'Gender not set'}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={13} className="text-gray-400" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={13} className="text-gray-400" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={13} className="text-gray-400" />
                  <span>Last visit: {formatDate(patient.lastVisit)}</span>
                </div>
              </div>

              {patient.lastReason && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">Last reason</p>
                  <p className="text-sm text-gray-600 truncate">{patient.lastReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPatients;
