import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pollAPI, voteAPI } from '../services/api';

export default function PollView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const role = localStorage.getItem('role');
  const isCreatorOrAdmin = role === 'CREATOR' || role === 'ADMIN';
  
  console.log('Current user role:', role);
  console.log('Is creator or admin:', isCreatorOrAdmin);

  const load = async () => {
    try {
      const [{ data: p }, { data: o }] = await Promise.all([
        pollAPI.getPollById(id),
        pollAPI.getPollById(id).then(() => []), // Placeholder for options
      ]);
      setPoll(p);
      setOptions(o || []);
    } catch (e) {
      setError('Failed to load poll');
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [id]);

  const vote = async (optionId) => {
    try {
      await voteAPI.vote(optionId);
      await load();
    } catch (e) {
      setError('Vote failed (maybe already voted)');
    }
  };

  const closePoll = async () => {
    if (!window.confirm('Are you sure you want to close this poll? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      console.log('Closing poll with ID:', id);
      const response = await pollAPI.closePoll(id);
      console.log('Close poll response:', response);
      await load(); // Refresh to show updated status
    } catch (e) {
      console.error('Close poll error:', e);
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to close poll';
      setError(`Failed to close poll: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div className="p-6">Loading...</div>;

  const total = options.reduce((s, o) => s + (o.voteCount || 0), 0) || 1;

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          {error && <div className="text-red-400 mb-3 bg-red-900/20 border border-red-800 rounded p-2 text-sm">{error}</div>}
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-white">{poll.question}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  poll.status === 'OPEN' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {poll.status}
                </span>
                <span className="text-xs text-gray-400">{poll.privacy}</span>
              </div>
            </div>
            
            {isCreatorOrAdmin && poll.status === 'OPEN' && (
              <button 
                onClick={() => {
                  console.log('Close poll button clicked');
                  console.log('Poll ID:', id);
                  console.log('Poll status:', poll.status);
                  closePoll();
                }}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Closing...' : 'Close Poll'}
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {options.map(opt => {
              const pct = Math.round(((opt.voteCount || 0) / total) * 100);
              return (
                <div key={opt.id} className="border border-gray-600 rounded-xl p-3 bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-white">{opt.text}</div>
                    {poll.status === 'OPEN' && (
                      <button 
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition" 
                        onClick={() => vote(opt.id)}
                      >
                        Vote
                      </button>
                    )}
                  </div>
                  <div className="h-2 bg-gray-600 rounded mt-2">
                    <div className="h-2 bg-blue-500 rounded" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{pct}% ({opt.voteCount || 0} votes)</div>
                </div>
              );
            })}
          </div>
          
          {poll.status === 'CLOSED' && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate(`/polls/${id}/results`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


