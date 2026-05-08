import React, { useEffect, useState, useCallback } from 'react';
import { getAppointments, updateAppointment } from '../../api/appointment.api';
import AppointmentTable from '../../components/common/AppointmentTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState({ open: false, apt: null });
  const [form, setForm] = useState({ status: '', notes: '' });
  const [saving, setSaving] = useState(false);

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

  const handleAction = (key, apt) => {
    if (key === 'update') {
      setForm({ status: apt.status, notes: apt.notes || '' });
      setModal({ open: true, apt });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAppointment(modal.apt._id, form);
      setModal({ open: false });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
        <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <AppointmentTable
          appointments={appointments}
          showDoctor={false}
          onAction={handleAction}
          actions={[{ key: 'update', label: 'Update', variant: 'secondary' }]}
        />
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title="Update Appointment">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor notes</label>
            <textarea
              className="input h-28 resize-none"
              placeholder="Add clinical notes…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
