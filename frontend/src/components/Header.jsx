import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="w-full bg-gray-800 shadow border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-white">True Vote</Link>
        <nav className="space-x-4 text-sm">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/polls" className="text-gray-300 hover:text-white">Polls</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          {(role === 'CREATOR' || role === 'ADMIN') && <Link to="/creator" className="text-gray-300 hover:text-white">Creator</Link>}
          {role === 'ADMIN' && <Link to="/admin" className="text-gray-300 hover:text-white">Admin</Link>}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}


