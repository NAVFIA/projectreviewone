import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function PollCreate() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const addOption = () => setOptions([...options, '']);
  const updateOption = (idx, val) => {
    const copy = options.slice();
    copy[idx] = val;
    setOptions(copy);
  };
  const removeOption = (idx) => {
    const copy = options.slice();
    copy.splice(idx, 1);
    setOptions(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      setError('Enter a question and at least two options');
      return;
    }
    try {
      const { data: poll } = await api.post('/polls', {
        question,
        privacy,
        status: 'OPEN'
      });
      const nonEmpty = options.filter(o => o.trim());
      for (const text of nonEmpty) {
        await api.post('/options', { text, poll: { id: poll.id } });
      }
      navigate('/creator');
    } catch (e) {
      setError('Failed to create poll');
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-1 text-white">Create Poll</h1>
          <p className="text-gray-400 mb-4">Define your question and choices, then publish.</p>
          {error && <div className="text-red-400 mb-3 bg-red-900/20 border border-red-800 rounded p-2 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Question</label>
              <input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={question} onChange={e => setQuestion(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Privacy</label>
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Options</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 flex-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={opt} onChange={e => updateOption(idx, e.target.value)} />
                    <button type="button" className="px-3 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500" onClick={() => removeOption(idx)}>Remove</button>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-2 px-3 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500" onClick={addOption}>Add Option</button>
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}


