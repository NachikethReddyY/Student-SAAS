import { LogIn } from 'lucide-react';
import { useSAS } from '../context';
import { motion } from 'motion/react';

export default function LoginView() {
  const { login, error } = useSAS();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-zinc-200 p-10 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto rotate-12 shadow-lg">
          <span className="text-3xl font-black">SAS</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Student Assistant</h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Your academic command center. Sign in to sync your modules, assignments, and notes.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-4 bg-white border-2 border-zinc-200 text-zinc-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-50 hover:border-blue-600 hover:text-blue-600 transition-all shadow-md active:scale-95 group"
        >
          <LogIn size={24} className="group-hover:scale-110 transition-transform" />
          Sign in with Google
        </button>

        <p className="text-zinc-400 text-sm">
          Securely sync your data across all your devices.
        </p>
      </motion.div>
    </div>
  );
}
