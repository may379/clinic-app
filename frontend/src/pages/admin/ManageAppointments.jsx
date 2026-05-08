import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { getAppointments, updateAppointment, deleteAppointment, createAppointment } from '../../api/appointment.api';
import { getUsers } from '../../api/user.api';
import AppointmentTable from '../../components/common/AppointmentTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_FORM = { patient: '', doctor: '', date: '', time: '', reason: '', notes: '', status: 'pending' };

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'create', apt: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [aptsRes, docsRes, patsRes] = await Promise.all([
        getAppointments({ status: statusFilter }),
        getUsers({ role: 'doctor' }),
        getUsers({ role: 'patient' }),
      ]);
      setAppointments(aptsRes.data.data);
      setDoctors(docsRes.data.data);
      setPatients(patsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError('');
    setModal({ open: true, mode: 'create', apt: null });
  };

  const handleAction = (key, apt) => {
    if (key === 'edit') {
      setForm({
        patient: apt.patient?._id || '',
        doctor: apt.doctor?._id || '',
        date: apt.date?.slice(0, 10) || '',
        time: apt.time || '',
        reason: apt.reason || '',
        notes: apt.notes || '',
        status: apt.status || 'pending',
      });
      setError('');
      setModal({ open: true, mode: 'edit', apt });
    }
    if (key === 'delete') {
      if (!confirm('Delete this appointment?')) return;
      deleteAppointment(apt._id).then(fetchAll).catch(console.error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modal.mode === 'create') {
        await createAppointment(form);
      } else {
        await updateAppointment(modal.apt._id, form);
      }
      setModal({ open: false });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appointment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const tableActions = [
    { key: 'edit', label: 'Edit', variant: 'secondary' },
    { key: 'delete', label: 'Delete', variant: 'danger' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-2">
          <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <div className="card">
        <AppointmentTable
          appointments={appointments}
          onAction={handleAction}
          actions={tableActions}
        />
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === 'create' ? 'Create Appointment' : 'Edit Appointment'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
            <select className="input" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient…</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
            <select className="input" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
              <option value="">Select doctor…</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} {d.specialization ? `— ${d.specialization}` : ''}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="input h-20 resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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

export default ManageAppointments;
