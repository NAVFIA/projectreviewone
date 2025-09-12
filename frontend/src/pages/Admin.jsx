import { useEffect, useState } from 'react';
import { userAPI, pollAPI } from '../services/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const loadUsers = async () => {
    try {
      const { data } = await userAPI.getAllUsers();
      setUsers(data);
    } catch (e) {
      setError('Failed to load users');
    }
  };

  const loadPolls = async () => {
    try {
      const { data } = await pollAPI.getAllPolls();
      setPolls(data);
    } catch (e) {
      setError('Failed to load polls');
    }
  };

  useEffect(() => {
    loadUsers();
    loadPolls();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await userAPI.updateUserRole(id, role);
      await loadUsers();
    } catch (e) {
      setError('Failed to update role');
    }
  };

  const closePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) {
      return;
    }
    
    try {
      await pollAPI.closePoll(pollId);
      await loadPolls();
    } catch (e) {
      setError('Failed to close poll');
    }
  };

  const deletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }
    
    try {
      await pollAPI.deletePoll(pollId);
      await loadPolls();
    } catch (e) {
      setError('Failed to delete poll');
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'polls'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Polls ({polls.length})
            </button>
          </div>
          
          {error && <div className="text-red-400 mb-3 bg-red-900/20 border border-red-800 rounded p-2 text-sm">{error}</div>}
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="p-3 text-gray-300">ID</th>
                    <th className="p-3 text-gray-300">Name</th>
                    <th className="p-3 text-gray-300">Email</th>
                    <th className="p-3 text-gray-300">Role</th>
                    <th className="p-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-600 hover:bg-gray-700">
                      <td className="p-3 text-gray-300">{u.id}</td>
                      <td className="p-3 text-white">{u.name}</td>
                      <td className="p-3 text-gray-300">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'ADMIN' ? 'bg-red-900 text-red-300' :
                          u.role === 'CREATOR' ? 'bg-blue-900 text-blue-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                          u.role === 'VOTER' ? 'bg-green-800 text-green-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`} onClick={() => updateRole(u.id, 'VOTER')}>VOTER</button>
                        <button className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                          u.role === 'CREATOR' ? 'bg-blue-800 text-blue-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`} onClick={() => updateRole(u.id, 'CREATOR')}>CREATOR</button>
                        <button className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                          u.role === 'ADMIN' ? 'bg-red-800 text-red-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`} onClick={() => updateRole(u.id, 'ADMIN')}>ADMIN</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Polls Tab */}
          {activeTab === 'polls' && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="p-3 text-gray-300">ID</th>
                    <th className="p-3 text-gray-300">Question</th>
                    <th className="p-3 text-gray-300">Status</th>
                    <th className="p-3 text-gray-300">Privacy</th>
                    <th className="p-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {polls.map(p => (
                    <tr key={p.id} className="border-b border-gray-600 hover:bg-gray-700">
                      <td className="p-3 text-gray-300">{p.id}</td>
                      <td className="p-3 text-white max-w-xs truncate">{p.question}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === 'OPEN' ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">{p.privacy}</td>
                      <td className="p-3 space-x-2">
                        {p.status === 'OPEN' && (
                          <button
                            onClick={() => closePoll(p.id)}
                            className="px-2 py-1 bg-orange-900 text-orange-300 rounded text-xs hover:bg-orange-800"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => deletePoll(p.id)}
                          className="px-2 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {polls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">No polls found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


