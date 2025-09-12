import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Results() {
  const { id } = useParams();
  const [options, setOptions] = useState([]);
  const [poll, setPoll] = useState(null);

  const load = async () => {
    const [{ data: p }, { data: o }] = await Promise.all([
      api.get(`/polls/${id}`),
      api.get(`/options/poll/${id}`),
    ]);
    setPoll(p);
    setOptions((o || []).map(op => ({ name: op.text, votes: op.voteCount || 0 })));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [id]);

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-2 text-white">Results{poll ? `: ${poll.question}` : ''}</h1>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={options}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis allowDecimals={false} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Bar dataKey="votes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


