import { useState } from 'react';
import { useSAS } from '../context';
import { Plus, Check, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../utils';
import React from 'react';

export default function Inbox() {
  const { inbox, addInboxItem, processInboxItem } = useSAS();
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addInboxItem(newItem);
    setNewItem('');
  };

  const pendingItems = inbox.filter(i => !i.processed);
  const processedItems = inbox.filter(i => i.processed);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-zinc-500 mt-1">Capture everything, process later.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-600">
          <Sparkles size={14} className="text-blue-600" />
          AI Processing Ready
        </div>
      </div>

      {/* Quick Add */}
      <form onSubmit={handleAdd} className="relative">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="I need to remember to..." 
          className="w-full pl-4 pr-12 py-4 bg-white border border-zinc-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-lg"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Unprocessed</h2>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {pendingItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => processInboxItem(item.id)}
                      className="w-6 h-6 border-2 border-zinc-200 rounded-full flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Check size={14} className="text-blue-600 opacity-0 hover:opacity-100" />
                    </button>
                    <div>
                      <p className="text-zinc-900">{item.text}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Sparkles size={18} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pendingItems.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400">
                Your inbox is empty. Great job!
              </div>
            )}
          </div>
        </section>

        {processedItems.length > 0 && (
          <section className="space-y-4 pt-8">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recently Processed</h2>
            <div className="space-y-2 opacity-60">
              {processedItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                  <div className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-zinc-500" />
                  </div>
                  <p className="text-zinc-500 line-through">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
