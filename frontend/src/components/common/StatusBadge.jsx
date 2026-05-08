import React from 'react';

const StatusBadge = ({ status, type = 'appointment' }) => {
  const appointmentMap = {
    pending: 'badge-pending',
    done: 'badge-done',
    cancelled: 'badge-cancelled',
  };
  const roleMap = {
    admin: 'badge-admin',
    doctor: 'badge-doctor',
    patient: 'badge-patient',
  };

  const map = type === 'role' ? roleMap : appointmentMap;
  const className = map[status] || 'badge bg-gray-100 text-gray-700';

  return (
    <span className={className}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
    </span>
  );
};

export default StatusBadge;
