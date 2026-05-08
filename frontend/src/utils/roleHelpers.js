export const isAdmin = (user) => user?.role === 'admin';
export const isDoctor = (user) => user?.role === 'doctor';
export const isPatient = (user) => user?.role === 'patient';

export const getRoleBadgeClass = (role) => {
  const map = { admin: 'badge-admin', doctor: 'badge-doctor', patient: 'badge-patient' };
  return map[role] || 'badge';
};

export const getRoleLabel = (role) => {
  const map = { admin: 'Admin', doctor: 'Doctor', patient: 'Patient' };
  return map[role] || role;
};
