import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VOTER');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password, role, inviteCode });
      navigate('/login');
    } catch (err) {
      if (err?.response) {
        const status = err.response.status;
        const data = typeof err.response.data === 'string' ? err.response.data : (err.response.data?.message || JSON.stringify(err.response.data || {}));
        setError(`Registration failed (HTTP ${status}): ${data}`);
      } else if (err?.request) {
        setError('Registration failed: Network/CORS error. Is the backend running and CORS enabled?');
      } else {
        setError(`Registration failed: ${err?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-1 text-center text-white">Create your account</h1>
        <p className="text-center text-gray-400 mb-4">Register to start voting or creating</p>
        {error && <div className="text-red-400 text-sm mb-3 text-center bg-red-900/20 border border-red-800 rounded p-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Role</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="VOTER">VOTER</option>
              <option value="CREATOR">CREATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {(role === 'CREATOR' || role === 'ADMIN') && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Invite Code</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg shadow hover:bg-green-700 transition">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Have an account? <Link to="/login" className="text-blue-400 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}


