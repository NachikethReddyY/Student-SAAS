import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
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
} from 'lucide-react';
import { Module } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<Module, 'id'>) => void;
  initialData?: Module;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

const ICONS = [
  { name: 'Book', icon: Book },
  { name: 'Code', icon: Code },
  { name: 'Calculator', icon: Calculator },
  { name: 'FlaskConical', icon: FlaskConical },
  { name: 'Globe', icon: Globe },
  { name: 'Music', icon: Music },
  { name: 'Palette', icon: Palette },
  { name: 'Dna', icon: Dna },
  { name: 'Cpu', icon: Cpu },
  { name: 'Atom', icon: Atom },
  { name: 'Terminal', icon: Terminal },
  { name: 'Languages', icon: Languages },
  { name: 'Binary', icon: Binary },
  { name: 'Microscope', icon: Microscope },
  { name: 'History', icon: History },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Library', icon: Library },
  { name: 'Pencil', icon: Pencil },
  { name: 'PenTool', icon: PenTool },
  { name: 'Beaker', icon: Beaker },
  { name: 'Brain', icon: Brain },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Puzzle', icon: Puzzle },
  { name: 'Target', icon: Target },
  { name: 'Trophy', icon: Trophy },
  { name: 'Users', icon: Users },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Video', icon: Video },
  { name: 'Map', icon: Map },
  { name: 'Compass', icon: Compass },
  { name: 'Cloud', icon: Cloud },
  { name: 'Zap', icon: Zap },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Database', icon: Database },
  { name: 'Server', icon: Server },
  { name: 'Monitor', icon: Monitor },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Mail', icon: Mail },
  { name: 'Send', icon: Send },
  { name: 'Flag', icon: Flag },
  { name: 'Tag', icon: Tag },
  { name: 'Bookmark', icon: Bookmark },
];

export default function ModuleModal({ isOpen, onClose, onSave, initialData }: ModuleModalProps) {
  const [formData, setFormData] = useState<Omit<Module, 'id'>>({
    code: '',
    name: '',
    credits: 0,
    color: COLORS[0],
    semester: 'sem1',
    description: '',
    icon: 'Book',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        credits: initialData.credits,
        color: initialData.color,
        semester: initialData.semester || 'sem1',
        description: initialData.description || '',
        icon: initialData.icon || 'Book',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        credits: 0,
        color: COLORS[0],
        semester: 'sem1',
        description: '',
        icon: 'Book',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentSemester = (currentMonth >= 3 && currentMonth <= 8) ? 'sem1' : 'sem2';

  const getSemesterYearLabel = (semester: 'sem1' | 'sem2') => {
    if (currentMonth <= 2) { // Jan - Mar
      if (semester === 'sem1') return `Apr - Sep ${currentYear}`;
      return `Oct ${currentYear - 1} - Mar ${currentYear}`;
    } else if (currentMonth <= 8) { // Apr - Sep
      if (semester === 'sem1') return `Apr - Sep ${currentYear}`;
      return `Oct ${currentYear} - Mar ${currentYear + 1}`;
    } else { // Oct - Dec
      if (semester === 'sem1') return `Apr - Sep ${currentYear + 1}`;
      return `Oct ${currentYear} - Mar ${currentYear + 1}`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0">
            <h2 className="text-xl font-bold">{initialData ? 'Edit Module' : 'Add New Module'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Module Code</label>
                <input
                  required
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. CS101"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Module Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Computer Science Fundamentals"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Credits</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, credits: Math.max(0, formData.credits - 1) })}
                    className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-600"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-center font-bold text-lg">
                    {formData.credits}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, credits: formData.credits + 1 })}
                    className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional module description..."
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Semester</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, semester: 'sem1' })}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-all text-center relative",
                      formData.semester === 'sem1'
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    {getSemesterYearLabel('sem1')}
                    {currentSemester === 'sem1' && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full font-bold uppercase shadow-sm">Current</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, semester: 'sem2' })}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-all text-center relative",
                      formData.semester === 'sem2'
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    {getSemesterYearLabel('sem2')}
                    {currentSemester === 'sem2' && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full font-bold uppercase shadow-sm">Current</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Module Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {ICONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={cn(
                        "p-2 rounded-lg border transition-all flex items-center justify-center",
                        formData.icon === name
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100"
                      )}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-blue-600 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {initialData ? 'Save Changes' : 'Create Module'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
