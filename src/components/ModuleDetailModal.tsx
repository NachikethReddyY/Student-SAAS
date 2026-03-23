import React, { useState } from 'react';
import { 
  X, 
  Book, 
  Code, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Music, 
  Palette, 
  Dna, 
  Cpu, 
  Atom, 
  Terminal, 
  Languages,
  Binary,
  Microscope,
  History,
  Briefcase,
  GraduationCap,
  Library,
  Pencil,
  PenTool,
  Beaker,
  Brain,
  Lightbulb,
  Puzzle,
  Target,
  Trophy,
  Users,
  MessageSquare,
  Video,
  Map,
  Compass,
  Cloud,
  Zap,
  Heart,
  Star,
  Database,
  Server,
  Monitor,
  Smartphone,
  Mail,
  Send,
  Flag,
  Tag,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Circle
} from 'lucide-react';
import { Module, Deadline } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../utils';
import { useSAS } from '../context';
import AssignmentModal from './AssignmentModal';
import AssignmentDetailModal from './AssignmentDetailModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ExternalLink } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Book, 
  Code, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Music, 
  Palette, 
  Dna, 
  Cpu, 
  Atom, 
  Terminal, 
  Languages,
  Binary,
  Microscope,
  History,
  Briefcase,
  GraduationCap,
  Library,
  Pencil,
  PenTool,
  Beaker,
  Brain,
  Lightbulb,
  Puzzle,
  Target,
  Trophy,
  Users,
  MessageSquare,
  Video,
  Map,
  Compass,
  Cloud,
  Zap,
  Heart,
  Star,
  Database,
  Server,
  Monitor,
  Smartphone,
  Mail,
  Send,
  Flag,
  Tag,
  Bookmark
};

interface ModuleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  deadlines: Deadline[];
}

export default function ModuleDetailModal({ isOpen, onClose, module, deadlines }: ModuleDetailModalProps) {
  const { updateDeadlineStatus, updateDeadline, deleteDeadline, modules } = useSAS();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Deadline | undefined>(undefined);
  const [selectedAssignment, setSelectedAssignment] = useState<Deadline | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deadlineToDelete, setDeadlineToDelete] = useState<string | null>(null);

  if (!module) return null;

  const moduleDeadlines = deadlines.filter(d => d.moduleId === module.id);
  const completed = moduleDeadlines.filter(d => d.status === 'completed').length;
  const total = moduleDeadlines.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const pendingDeadlines = moduleDeadlines
    .filter(d => d.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header with Color Banner */}
            <div 
              className="h-32 sm:h-40 w-full relative"
              style={{ backgroundColor: module.color }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              
              <div className="absolute -bottom-10 left-8">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-zinc-900 border-4 border-white"
                  style={{ color: module.color }}
                >
                  {module.icon && ICON_MAP[module.icon] ? (
                    React.createElement(ICON_MAP[module.icon], { size: 40 })
                  ) : (
                    <span className="text-3xl font-bold">{module.code.charAt(0)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-14 px-8 pb-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      module.semester === 'sem1' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                    )}>
                      {module.semester === 'sem1' ? 'Semester 1' : 'Semester 2'}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {module.code}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">{module.name}</h2>
                  <p className="text-zinc-500 font-medium mt-1">{module.credits} Academic Credits</p>
                </div>
                
                <div className="bg-zinc-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-2xl font-bold text-zinc-900">{Math.round(progress)}%</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Completion</span>
                </div>
              </div>

              {module.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">About this Module</h3>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-2xl italic">
                    {module.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Upcoming Deadlines
                  </h3>
                  
                  <div className="space-y-3">
                    {pendingDeadlines.length > 0 ? (
                      pendingDeadlines.slice(0, 3).map(deadline => {
                        const isPastDue = deadline.status !== 'completed' && new Date(deadline.dueDate) < new Date();
                        
                        return (
                          <div key={deadline.id} className={cn("flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl shadow-sm group relative", activeMenu === deadline.id && "z-50")}>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateDeadlineStatus(deadline.id, 'completed')}
                                className="text-zinc-300 hover:text-emerald-600 transition-colors"
                              >
                                <Circle size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedAssignment(deadline);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-left group/title"
                              >
                                <p className="text-sm font-bold text-zinc-900 line-clamp-1 group-hover/title:text-blue-600 transition-colors flex items-center gap-2">
                                  {deadline.title}
                                  <ExternalLink size={12} className="opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                </p>
                                <p className={cn(
                                  "text-[10px] font-medium",
                                  isPastDue ? "text-red-600 font-bold" : "text-zinc-500"
                                )}>
                                  {isPastDue ? 'PAST DUE • ' : ''}{formatDate(deadline.dueDate)}
                                </p>
                              </button>
                            </div>
                            
                            <div className="relative">
                              <button 
                                onClick={() => setActiveMenu(activeMenu === deadline.id ? null : deadline.id)}
                                className="p-1 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 opacity-0 group-hover:opacity-100"
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
                        );
                      })
                    ) : (
                      <p className="text-xs text-zinc-400 italic">No pending deadlines.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Module Stats
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                      <span className="text-xs font-medium text-zinc-500">Total Tasks</span>
                      <span className="text-sm font-bold text-zinc-900">{total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                      <span className="text-xs font-medium text-zinc-500">Completed</span>
                      <span className="text-sm font-bold text-emerald-600">{completed}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                      <span className="text-xs font-medium text-zinc-500">Remaining</span>
                      <span className="text-sm font-bold text-blue-600">{total - completed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
            moduleColor={module.color}
            moduleCode={module.code}
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
      )}
    </AnimatePresence>
  );
}
