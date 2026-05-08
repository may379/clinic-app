import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role) => {
    const map = { admin: '/admin', doctor: '/doctor', patient: '/patient' };
    return map[role] || '/login';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.data.user, data.data.token);
      navigate(redirectByRole(data.data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 flex-col items-center justify-center p-12 text-white relative overflow-hidden">

        {/* subtle glow */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

        <div className="max-w-sm text-center relative">

          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:scale-105 transition">
            <Stethoscope size={40} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-3 tracking-tight">ClinicMS</h1>

          <p className="text-white/70 text-lg">
            Modern clinic management for doctors, patients, and administrators.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['Admin', 'Full control'], ['Doctor', 'Patient care'], ['Patient', 'Easy booking']].map(([role, desc]) => (
              <div
                key={role}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/15 transition"
              >
                <p className="font-semibold text-sm">{role}</p>
                <p className="text-white/60 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">

        <div className="w-full max-w-sm">

          {/* mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">ClinicMS</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            Welcome back
          </h2>

          <p className="text-gray-500 text-sm mb-8">
            Sign in to your account to continue.
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.01] transition"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          {/* LINK */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:text-indigo-700 transition"
            >
              Register
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;