import { useState } from 'react';
import { 
  Globe, 
  Mail, 
  Calendar as CalendarIcon, 
  Layout, 
  Database, 
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../utils';
import { useSAS } from '../context';

export default function SettingsView() {
  const { user, logout } = useSAS();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth Popup
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account and system integrations.</p>
      </div>

      {/* User Account */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <UserIcon size={20} className="text-zinc-900" />
          <h2 className="text-xl font-semibold">Account</h2>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-12 h-12 rounded-full border-2 border-zinc-100"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{user?.displayName || 'Student'}</h3>
                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Google Workspace Integration */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-zinc-900" />
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                <img 
                  src="https://www.gstatic.com/images/branding/product/2x/google_workspace_96dp.png" 
                  alt="Google Workspace" 
                  className="w-8 h-8"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Google Workspace</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-md">
                  Connect your Google account to sync Calendar events, Drive documents, and Gmail tasks directly into your SAS dashboard.
                </p>
              </div>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                Connected
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className={cn(
                  "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm",
                  isConnecting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isConnecting ? <RefreshCw size={16} className="animate-spin" /> : null}
                {isConnecting ? 'Connecting...' : 'Connect Workspace'}
              </button>
            )}
          </div>

          {isConnected && (
            <div className="mt-8 pt-8 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <IntegrationToggle icon={CalendarIcon} label="Google Calendar" enabled={true} />
              <IntegrationToggle icon={Mail} label="Gmail Tasks" enabled={true} />
              <IntegrationToggle icon={Database} label="Google Drive" enabled={false} />
            </div>
          )}
        </div>
      </section>

      {/* System Preferences */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layout size={20} className="text-zinc-900" />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl divide-y divide-zinc-100 shadow-sm">
          <PreferenceItem 
            title="Dark Mode" 
            description="Switch between light and dark themes." 
            type="toggle" 
          />
          <PreferenceItem 
            title="Notifications" 
            description="Receive alerts for upcoming deadlines." 
            type="toggle" 
            defaultChecked={true}
          />
          <PreferenceItem 
            title="AI Assistant" 
            description="Enable smart processing for your Inbox." 
            type="toggle" 
            defaultChecked={true}
          />
        </div>
      </section>
    </div>
  );
}

function IntegrationToggle({ icon: Icon, label, enabled }: { icon: any, label: string, enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-zinc-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={cn(
        "w-2 h-2 rounded-full",
        enabled ? "bg-green-500" : "bg-zinc-300"
      )} />
    </div>
  );
}

function PreferenceItem({ title, description, type, defaultChecked = false }: { title: string, description: string, type: 'toggle', defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="p-6 flex items-center justify-between">
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-colors relative",
          checked ? "bg-blue-600" : "bg-zinc-200"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
          checked ? "left-7" : "left-1"
        )} />
      </button>
    </div>
  );
}
