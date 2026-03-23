import { useState } from 'react';
import { useSAS } from './context';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inbox from './components/Inbox';
import CalendarView from './components/CalendarView';
import ModulesView from './components/ModulesView';
import AssignmentsView from './components/AssignmentsView';
import NotesView from './components/NotesView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import ErrorBoundary from './components/ErrorBoundary';
import { SASProvider } from './context';
import { Loader2 } from 'lucide-react';

function SASApp() {
  const { user, loading } = useSAS();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-zinc-500 font-bold tracking-tight">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inbox': return <Inbox />;
      case 'calendar': return <CalendarView />;
      case 'modules': return <ModulesView />;
      case 'assignments': return <AssignmentsView />;
      case 'notes': return <NotesView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SASProvider>
        <SASApp />
      </SASProvider>
    </ErrorBoundary>
  );
}
