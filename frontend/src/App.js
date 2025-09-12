import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Home from './pages/Home';
import PollList from './pages/PollList';
import PollCreate from './pages/PollCreate';
import PollView from './pages/PollView';
import Results from './pages/Results';
import CreatorDashboard from './pages/CreatorDashboard';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import './index.css';
import api from './services/api';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<PollList />} />
        <Route path="/polls/create" element={
          <PrivateRoute>
            {localStorage.getItem('role') === 'CREATOR' || localStorage.getItem('role') === 'ADMIN' ? <PollCreate /> : <Navigate to="/login" replace />}
          </PrivateRoute>
        } />
        <Route path="/polls/:id" element={<PollView />} />
        <Route path="/polls/:id/results" element={<Results />} />
        <Route path="/creator" element={
          <PrivateRoute>
            {localStorage.getItem('role') === 'CREATOR' || localStorage.getItem('role') === 'ADMIN' ? <CreatorDashboard /> : <Navigate to="/login" replace />}
          </PrivateRoute>
        } />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              {localStorage.getItem('role') === 'ADMIN' ? <Admin /> : <Navigate to="/dashboard" replace />} 
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
