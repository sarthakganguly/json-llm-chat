import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/users/', {
        email,
        password,
        tenant_name: tenantName,
      });
      navigate('/login');
    } catch (err) {
      setError('Failed to register. The email might already be in use.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Create an Account</h1>
            <p className="text-slate-500">Get started with your financial data</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="tenantName"
              className="block text-sm font-medium text-slate-700"
            >
              Company / Tenant Name
            </label>
            <input
              id="tenantName"
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Company Inc."
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-slate-400"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
         <p className="text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
