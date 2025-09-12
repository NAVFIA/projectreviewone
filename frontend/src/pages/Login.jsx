import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password, username: email });
      localStorage.setItem('token', data.token);
      if (data.role) {
        localStorage.setItem('role', data.role);
      }
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      const data = typeof err?.response?.data === 'string' ? err.response.data : (err?.response?.data?.message || JSON.stringify(err?.response?.data || {}));
      setError(`Login failed${status ? ` (HTTP ${status})` : ''}: ${data}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-1 text-center text-white">Welcome back</h1>
        <p className="text-center text-gray-400 mb-4">Sign in to continue</p>
        {error && <div className="text-red-400 text-sm mb-3 text-center bg-red-900/20 border border-red-800 rounded p-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg shadow hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          No account? <Link to="/register" className="text-blue-400 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}


