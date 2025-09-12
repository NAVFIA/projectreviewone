import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const isCreator = useMemo(() => localStorage.getItem('role') === 'CREATOR', []);

  const onCreatePoll = () => {
    if (isCreator) navigate('/creator');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),rgba(255,255,255,0))]"></div>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">True Vote</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">A fast, modern online voting system. Create polls, collect votes in real time, and visualize results instantly.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onCreatePoll} className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 hover:-translate-y-0.5 transition">Create Poll</button>
            <Link to="/polls" className="px-5 py-3 rounded-lg ring-1 ring-gray-600 text-gray-300 hover:bg-gray-800 transition">Browse Public Polls</Link>
          </div>
          <div className="mt-6 space-x-4">
            <Link to="/login" className="underline underline-offset-4 text-gray-300">Login</Link>
            <Link to="/register" className="underline underline-offset-4 text-gray-300">Register</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-xl shadow p-5 border border-gray-700">
            <div className="text-sm text-gray-400">Speed</div>
            <div className="text-lg font-semibold text-white">Real-time results</div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow p-5 border border-gray-700">
            <div className="text-sm text-gray-400">Security</div>
            <div className="text-lg font-semibold text-white">JWT protected APIs</div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow p-5 border border-gray-700">
            <div className="text-sm text-gray-400">Flexibility</div>
            <div className="text-lg font-semibold text-white">Public & private polls</div>
          </div>
        </div>
      </section>
    </div>
  );
}


