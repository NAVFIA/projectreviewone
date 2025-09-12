import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pollAPI } from '../services/api';

export default function CreatorDashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    pollAPI.getAllPolls().then(r => setPolls(r.data || [])).catch(() => setPolls([]));
  }, []);

  const closePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) {
      return;
    }
    
    setLoading(prev => ({ ...prev, [pollId]: true }));
    try {
      await pollAPI.closePoll(pollId);
      // Refresh polls list
      const response = await pollAPI.getAllPolls();
      setPolls(response.data || []);
    } catch (error) {
      alert('Failed to close poll');
    } finally {
      setLoading(prev => ({ ...prev, [pollId]: false }));
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          <Link to="/polls/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">New Poll</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map(p => (
            <div key={p.id} className="bg-gray-800 rounded-2xl shadow p-4 hover:shadow-md transition border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.status === 'OPEN' ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'
                }`}>
                  {p.status}
                </span>
                <span className="text-xs text-gray-400">{p.privacy}</span>
              </div>
              <div className="font-semibold line-clamp-2 mt-1 text-white">{p.question}</div>
              <div className="mt-3 flex gap-3 text-sm">
                <Link to={`/polls/${p.id}`} className="text-blue-400 hover:underline">View</Link>
                <Link to={`/polls/${p.id}/results`} className="text-green-400 hover:underline">Results</Link>
                {p.status === 'OPEN' && (
                  <button 
                    onClick={() => closePoll(p.id)}
                    disabled={loading[p.id]}
                    className="text-red-400 hover:underline disabled:opacity-50"
                  >
                    {loading[p.id] ? 'Closing...' : 'Close'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {polls.length === 0 && (
            <div className="text-gray-400">No polls yet. Create your first poll.</div>
          )}
        </div>
      </div>
    </div>
  );
}


