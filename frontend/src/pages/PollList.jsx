import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/polls').then(r => setPolls(r.data || [])).catch(() => setPolls([]));
  }, []);

  const filtered = useMemo(() => {
    return (polls || []).filter(p => {
      const matchQ = q ? (p.question || '').toLowerCase().includes(q.toLowerCase()) : true;
      const matchStatus = status ? (p.status === status) : true;
      return matchQ && matchStatus;
    });
  }, [polls, q, status]);

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-white">Public Polls</h1>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 flex-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search polls..." value={q} onChange={e => setQ(e.target.value)} />
            <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <Link key={p.id} to={`/polls/${p.id}`} className="block bg-gray-700 border border-gray-600 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.status === 'OPEN' ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {p.status}
                  </span>
                  <span className="text-xs text-gray-400">{p.privacy}</span>
                </div>
                <div className="font-semibold line-clamp-2 mt-1 text-white">{p.question}</div>
              </Link>
            ))}
            {filtered.length === 0 && <div className="text-gray-400">No polls found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}


