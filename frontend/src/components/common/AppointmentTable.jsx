import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../utils/formatDate';

const AppointmentTable = ({ appointments, onAction, actions = [], showPatient = true, showDoctor = true }) => {
  if (!appointments?.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {showPatient && <th className="text-left py-3 px-4 text-gray-500 font-medium">Patient</th>}
            {showDoctor && <th className="text-left py-3 px-4 text-gray-500 font-medium">Doctor</th>}
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Date & Time</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Reason</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
            {actions.length > 0 && <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              {showPatient && (
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{apt.patient?.name || '—'}</p>
                  <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                </td>
              )}
              {showDoctor && (
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{apt.doctor?.name || '—'}</p>
                  <p className="text-xs text-gray-400">{apt.doctor?.specialization}</p>
                </td>
              )}
              <td className="py-3 px-4">
                <p>{formatDate(apt.date)}</p>
                <p className="text-xs text-gray-400">{apt.time}</p>
              </td>
              <td className="py-3 px-4 max-w-xs">
                <p className="truncate text-gray-700">{apt.reason}</p>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={apt.status} />
              </td>
              {actions.length > 0 && (
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => onAction(action.key, apt)}
                        className={`btn-${action.variant || 'secondary'} text-xs px-3 py-1`}
                        disabled={action.disabled?.(apt)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
