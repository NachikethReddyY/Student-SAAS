import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye,
  Bell,
  CheckSquare,
  Layout
} from 'lucide-react';
import { Deadline, SubTask, Status, Priority } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import Markdown from 'react-markdown';
import { ConfirmationModal } from './ConfirmationModal';

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Deadline | null;
  onUpdate: (id: string, updates: Partial<Deadline>) => void;
  onDelete: (id: string) => void;
  moduleColor?: string;
  moduleCode?: string;
}

export default function AssignmentDetailModal({ 
  isOpen, 
  onClose, 
  assignment, 
  onUpdate,
  onDelete,
  moduleColor = '#3b82f6',
  moduleCode = 'MOD'
}: AssignmentDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(assignment?.description || '');
  const [tasks, setTasks] = useState<SubTask[]>(assignment?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (assignment) {
      setDescription(assignment.description || '');
      setTasks(assignment.tasks || []);
    }
  }, [assignment]);

  if (!assignment) return null;

  const handleStatusChange = (newStatus: Status) => {
    onUpdate(assignment.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    onUpdate(assignment.id, { priority: newPriority });
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(assignment.id, { reminderDate: e.target.value });
  };

  const handleDescriptionSave = () => {
    onUpdate(assignment.id, { description });
    setIsEditingDescription(false);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: SubTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onUpdate(assignment.id, { tasks: updatedTasks });
    setNewTaskTitle('');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    onUpdate(assignment.id, { tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    onUpdate(assignment.id, { tasks: updatedTasks });
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-full sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header Section */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: moduleColor }}
                >
                  <Layout size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{moduleCode}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      assignment.priority === 'high' ? "bg-red-50 text-red-600" :
                      assignment.priority === 'medium' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {assignment.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">{assignment.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                {/* Main Content Area */}
                <div className="lg:col-span-2 p-8 space-y-10 border-r border-zinc-100">
                  {/* Description Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <Edit3 size={16} className="text-blue-600" />
                        Description
                      </h3>
                      <button 
                        onClick={() => isEditingDescription ? handleDescriptionSave() : setIsEditingDescription(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        {isEditingDescription ? (
                          <><CheckCircle2 size={14} /> Save</>
                        ) : (
                          <><Edit3 size={14} /> Edit</>
                        )}
                      </button>
                    </div>
                    
                    {isEditingDescription ? (
                      <div className="space-y-4">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Add a detailed description in Markdown..."
                          className="w-full h-64 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm leading-relaxed"
                        />
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Pro Tip</p>
                          <p className="text-xs text-blue-800/70">Use Markdown for bold, lists, and links to make your notes more readable.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-50 rounded-2xl p-6 min-h-[200px]">
                        {description ? (
                          <div className="markdown-body">
                            <Markdown>{description}</Markdown>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12">
                            <Edit3 size={32} className="mb-2 opacity-20" />
                            <p className="text-sm italic">No description added yet. Click edit to add one.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  {/* Tasks Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <CheckSquare size={16} className="text-emerald-600" />
                        Sub-Tasks
                      </h3>
                      <span className="text-xs font-bold text-zinc-400">
                        {completedTasks}/{tasks.length} Completed
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Progress Bar */}
                      {tasks.length > 0 && (
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${taskProgress}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl hover:border-zinc-200 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleTask(task.id)}
                                className={cn(
                                  "transition-colors",
                                  task.completed ? "text-emerald-500" : "text-zinc-300 hover:text-emerald-500"
                                )}
                              >
                                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                              </button>
                              <span className={cn(
                                "text-sm font-medium transition-colors",
                                task.completed ? "text-zinc-400 line-through" : "text-zinc-700"
                              )}>
                                {task.title}
                              </span>
                            </div>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTask()}
                          placeholder="Add a sub-task..."
                          className="flex-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        />
                        <button 
                          onClick={addTask}
                          className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Sidebar Controls */}
                <div className="bg-zinc-50/50 p-8 space-y-8">
                  {/* Status Control */}
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Status</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(['pending', 'in-progress', 'completed'] as Status[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                            assignment.status === s 
                              ? "bg-white border-zinc-200 shadow-sm text-zinc-900" 
                              : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            s === 'completed' ? "bg-emerald-500" : 
                            s === 'in-progress' ? "bg-blue-500" : "bg-zinc-300"
                          )} />
                          {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar size={12} /> Due Date
                      </h4>
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 flex items-center gap-2">
                        <Clock size={16} className="text-zinc-400" />
                        {assignment.dueDate}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Bell size={12} /> Reminder Date
                      </h4>
                      <input
                        type="date"
                        value={assignment.reminderDate || ''}
                        onChange={handleReminderChange}
                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Priority Section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Priority</h4>
                    <div className="flex flex-wrap gap-2">
                      {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePriorityChange(p)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                            assignment.priority === p
                              ? p === 'high' ? "bg-red-50 border-red-200 text-red-600" :
                                p === 'medium' ? "bg-orange-50 border-orange-200 text-orange-600" :
                                "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50"
                          )}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
                    >
                      <Trash2 size={16} />
                      Delete Assignment
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="pt-8 border-t border-zinc-200">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Eye size={16} />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Quick Stats</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Sub-tasks</span>
                          <span className="text-xs font-bold text-zinc-900">{tasks.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Progress</span>
                          <span className="text-xs font-bold text-emerald-600">{Math.round(taskProgress)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ConfirmationModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={() => {
                if (assignment) {
                  onDelete(assignment.id);
                  onClose();
                }
              }}
              title="Delete Assignment"
              message={`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`}
              confirmText="Delete Assignment"
              variant="danger"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
