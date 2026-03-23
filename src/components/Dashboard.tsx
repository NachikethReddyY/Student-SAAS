import { useState } from 'react';
import { useSAS } from '../context';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Circle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate, cn } from '../utils';
import AssignmentModal from './AssignmentModal';
import AssignmentDetailModal from './AssignmentDetailModal';
import { ConfirmationModal } from './ConfirmationModal';
import { Deadline } from '../types';

export default function Dashboard() {
  const { modules, deadlines, inbox, updateDeadlineStatus, updateDeadline, deleteDeadline } = useSAS();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Deadline | undefined>(undefined);
  const [selectedAssignment, setSelectedAssignment] = useState<Deadline | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deadlineToDelete, setDeadlineToDelete] = useState<string | null>(null);

  const upcomingDeadlines = deadlines
    .filter(d => d.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const handleEdit = (deadline: Deadline) => {
    setEditingAssignment(deadline);
    setIsAssignmentModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    setDeadlineToDelete(id);
    setActiveMenu(null);
  };

  const handleSaveAssignment = (data: Omit<Deadline, 'id'>) => {
    if (editingAssignment) {
      updateDeadline(editingAssignment.id, data);
    }
  };

  const pendingInbox = inbox.filter(i => !i.processed).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const sem1ModulesCount = modules.filter(m => m.semester === 'sem1').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your studies today.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Semester 1 Modules" 
          value={sem1ModulesCount.toString()} 
          icon={BookOpenIcon}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={upcomingDeadlines.length.toString()} 
          icon={Clock}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard 
          title="Inbox Items" 
          value={pendingInbox.toString()} 
          icon={InboxIcon}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard 
          title="Completed" 
          value={deadlines.filter(d => d.status === 'completed').length.toString()} 
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl">
            {upcomingDeadlines.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {upcomingDeadlines.map((deadline) => {
                  const module = modules.find(m => m.id === deadline.moduleId);
                  const isPastDue = deadline.status !== 'completed' && new Date(deadline.dueDate) < new Date();
                  
                  return (
                    <motion.div 
                      key={deadline.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors group relative", activeMenu === deadline.id && "z-50")}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateDeadlineStatus(deadline.id, 'completed')}
                          className="text-zinc-300 hover:text-emerald-600 transition-colors"
                        >
                          <Circle size={20} />
                        </button>
                        <div 
                          className="w-2 h-10 rounded-full" 
                          style={{ backgroundColor: module?.color || '#ccc' }} 
                        />
                        <button 
                          onClick={() => {
                            setSelectedAssignment(deadline);
                            setIsDetailModalOpen(true);
                          }}
                          className="text-left group/title"
                        >
                          <p className="font-medium group-hover/title:text-blue-600 transition-colors flex items-center gap-2">
                            {deadline.title}
                            <ExternalLink size={12} className="opacity-0 group-hover/title:opacity-100 transition-opacity" />
                          </p>
                          <p className="text-xs text-zinc-500">
                            {module?.code} • {deadline.type.toUpperCase()}
                          </p>
                        </button>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-medium",
                            isPastDue ? "text-red-600 font-bold" : "text-zinc-900"
                          )}>
                            {formatDate(deadline.dueDate)}
                          </p>
                          <p className={cn(
                            "text-xs font-medium",
                            isPastDue ? "text-red-500 font-bold" :
                            deadline.priority === 'high' ? "text-red-500" : "text-zinc-400"
                          )}>
                            {isPastDue ? 'PAST DUE' : `${deadline.priority.toUpperCase()} PRIORITY`}
                          </p>
                        </div>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenu(activeMenu === deadline.id ? null : deadline.id)}
                            className="p-1 hover:bg-zinc-200 rounded-md transition-colors text-zinc-400 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeMenu === deadline.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 top-8 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-[1000] py-1 overflow-hidden">
                                <button 
                                  onClick={() => {
                                    updateDeadlineStatus(deadline.id, 'completed');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
                                >
                                  <CheckCircle2 size={14} className="text-emerald-600" /> Mark as Complete
                                </button>
                                <button 
                                  onClick={() => handleEdit(deadline)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
                                >
                                  <Edit2 size={14} /> Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(deadline.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500">
                No upcoming deadlines. Time to relax!
              </div>
            )}
          </div>
        </div>

        {/* Quick Inbox */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
            <div className="space-y-3">
              {inbox.filter(i => !i.processed).slice(0, 3).map(item => (
                <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 group">
                  <div className="mt-1 w-4 h-4 border-2 border-zinc-300 rounded-sm group-hover:border-blue-600 transition-colors cursor-pointer" />
                  <p className="text-sm text-zinc-600">{item.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              Go to Inbox
            </button>
          </div>
        </div>
      </div>

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        modules={modules}
        initialData={editingAssignment}
        onDelete={deleteDeadline}
      />

      <AssignmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        assignment={selectedAssignment}
        onUpdate={updateDeadline}
        onDelete={deleteDeadline}
        moduleColor={modules.find(m => m.id === selectedAssignment?.moduleId)?.color}
        moduleCode={modules.find(m => m.id === selectedAssignment?.moduleId)?.code}
      />

      <ConfirmationModal
        isOpen={!!deadlineToDelete}
        onClose={() => setDeadlineToDelete(null)}
        onConfirm={() => {
          if (deadlineToDelete) {
            deleteDeadline(deadlineToDelete);
            setDeadlineToDelete(null);
          }
        }}
        title="Delete Deadline"
        message="Are you sure you want to delete this deadline? This action cannot be undone."
        confirmText="Delete Deadline"
        variant="danger"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm text-zinc-500 font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function BookOpenIcon(props: any) {
  return <BookOpen {...props} />;
}

import { BookOpen, Inbox as InboxIcon } from 'lucide-react';
