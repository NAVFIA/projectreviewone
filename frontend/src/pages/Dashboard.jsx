import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Example authenticated call; adjust to your backend endpoint if available
        const { data } = await api.get('/test/authenticated');
        setProfile(data);
      } catch (e) {
        setError('Failed to load profile');
        if (e?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    load();
  }, [navigate]);

  const role = localStorage.getItem('role') || 'VOTER';
  const email = localStorage.getItem('email') || '';

  const [polls, setPolls] = useState([]);
  useEffect(() => {
    api.get('/polls').then(r => setPolls(r.data || [])).catch(() => setPolls([]));
  }, []);

  const openPolls = useMemo(() => polls.filter(p => p.status === 'OPEN'), [polls]);
  const closedPolls = useMemo(() => polls.filter(p => p.status === 'CLOSED'), [polls]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-6 bg-gray-800 rounded-xl shadow w-full max-w-5xl border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Logged in as {email || 'user'} ({role})</p>
          </div>
          {(role === 'CREATOR' || role === 'ADMIN') && (
            <Link to="/polls/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:-translate-y-0.5 hover:shadow-md transition">Create Poll</Link>
          )}
        </div>
        {error && <div className="text-red-400 mt-4">{error}</div>}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="font-semibold mb-2 text-white">Open Polls</h2>
            <div className="space-y-2">
              {openPolls.slice(0,5).map(p => (
                <Link key={p.id} to={`/polls/${p.id}`} className="block border border-gray-600 rounded-lg p-3 hover:bg-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">OPEN</span>
                    <span className="text-xs text-gray-400">{p.privacy}</span>
                  </div>
                  <div className="font-medium text-white">{p.question}</div>
                </Link>
              ))}
              {openPolls.length === 0 && <div className="text-sm text-gray-400">No open polls.</div>}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-white">Recently Closed</h2>
            <div className="space-y-2">
              {closedPolls.slice(0,5).map(p => (
                <Link key={p.id} to={`/polls/${p.id}/results`} className="block border border-gray-600 rounded-lg p-3 hover:bg-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs font-medium">CLOSED</span>
                    <span className="text-xs text-gray-400">{p.privacy}</span>
                  </div>
                  <div className="font-medium text-white">{p.question}</div>
                </Link>
              ))}
              {closedPolls.length === 0 && <div className="text-sm text-gray-400">No closed polls.</div>}
            </div>
          </div>
        </div>
        {profile && (
          <pre className="mt-6 bg-gray-700 p-3 rounded-lg overflow-auto text-xs text-gray-300">{JSON.stringify(profile, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}


