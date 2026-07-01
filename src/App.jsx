import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import HomePage from './pages/client/HomePage';
import SchedulePage from './pages/client/SchedulePage';
import TasksPage from './pages/client/TasksPage';
import CrisisPage from './pages/client/CrisisPage';
import ProgramPage from './pages/client/ProgramPage';
import PersonalAreaPage from './pages/client/PersonalAreaPage';
import CommunityPage from './pages/client/CommunityPage';
import AdminClientsPage from './pages/admin/AdminClientsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';
import AdminCommunityPage from './pages/admin/AdminCommunityPage';
import AdminCrisisPage from './pages/admin/AdminCrisisPage';

function AppInner() {
  const { currentUser, loading } = useApp();
  const isAdmin = currentUser?.role === 'admin';
  const [page, setPage] = useState(isAdmin ? 'admin-clients' : 'home');

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2' }}>
      <div style={{ textAlign: 'center', color: '#A52A2A' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>♥</div>
        <div style={{ fontSize: 14, color: '#9B8F93' }}>טוענת...</div>
      </div>
    </div>
  );

  if (!currentUser) return <LoginPage />;

  function renderPage() {
    if (isAdmin) {
      switch (page) {
        case 'admin-clients':   return <AdminClientsPage />;
        case 'admin-events':    return <AdminEventsPage />;
        case 'admin-tasks':     return <AdminTasksPage />;
        case 'admin-videos':    return <AdminVideosPage />;
        case 'admin-community': return <AdminCommunityPage />;
        case 'admin-crisis':    return <AdminCrisisPage />;
        default:                return <AdminClientsPage />;
      }
    }
    switch (page) {
      case 'home':      return <HomePage onNavigate={setPage} />;
      case 'personal':  return <PersonalAreaPage onNavigate={setPage} />;
      case 'program':   return <ProgramPage />;
      case 'community': return <CommunityPage />;
      case 'schedule':  return <SchedulePage />;
      case 'tasks':     return <TasksPage />;
      case 'crisis':    return <CrisisPage />;
      default:          return <HomePage onNavigate={setPage} />;
    }
  }

  return (
    <Layout activePage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}