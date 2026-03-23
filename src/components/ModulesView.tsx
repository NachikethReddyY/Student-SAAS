import React, { useState } from 'react';
import { useSAS } from '../context';
import { 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Edit2,
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
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import ModuleModal from './ModuleModal';
import ModuleDetailModal from './ModuleDetailModal';
import { Module } from '../types';

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

export default function ModulesView() {
  const { modules, deadlines, addModule, updateModule, deleteModule } = useSAS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | undefined>(undefined);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingModule(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleViewDetails = (module: Module) => {
    setSelectedModule(module);
    setIsDetailModalOpen(true);
    setActiveMenu(null);
  };

  const handleSave = (moduleData: Omit<Module, 'id'>) => {
    if (editingModule) {
      updateModule(editingModule.id, moduleData);
    } else {
      addModule(moduleData);
    }
  };

  const currentMonth = new Date().getMonth(); // 0-indexed
  const currentYear = new Date().getFullYear();
  
  // Based on user request: 
  // Sem 1: Apr - Sep 2026
  // Sem 2: Oct 2026 - Mar 2027
  // Current date is March 2026, so these are the upcoming semesters.
  
  const getSemesterYearLabel = (semester: 'sem1' | 'sem2') => {
    if (semester === 'sem1') {
      return `Apr - Sep 2026`;
    } else {
      return `Oct 2026 - Mar 2027`;
    }
  };

  const sem1Modules = modules.filter(m => m.semester === 'sem1');
  const sem2Modules = modules.filter(m => m.semester === 'sem2');

  const renderModuleGrid = (moduleList: Module[], title: string, subtitle: string) => {
    if (moduleList.length === 0) return null;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {moduleList.map((module) => {
              const moduleDeadlines = deadlines.filter(d => d.moduleId === module.id);
              const completed = moduleDeadlines.filter(d => d.status === 'completed').length;
              const total = moduleDeadlines.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;

              return (
                <motion.div 
                  key={module.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleViewDetails(module)}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: module.color }}
                    >
                      {module.icon && ICON_MAP[module.icon] ? (
                        React.createElement(ICON_MAP[module.icon], { size: 24 })
                      ) : (
                        module.code.charAt(0)
                      )}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === module.id ? null : module.id);
                        }}
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {activeMenu === module.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(null);
                            }} 
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(module);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                              <Edit2 size={16} /> Edit Module
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModule(module.id);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Delete Module
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        module.semester === 'sem1' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                      )}>
                        {module.semester === 'sem1' ? 'Sem 1' : 'Sem 2'}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {getSemesterYearLabel(module.semester as 'sem1' | 'sem2')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-zinc-900 transition-colors">{module.name}</h3>
                    <p className="text-sm text-zinc-500 font-medium">{module.code} • {module.credits} Credits</p>
                    {module.description && (
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed italic">
                        {module.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-zinc-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500" 
                          style={{ 
                            backgroundColor: module.color,
                            width: `${progress}%`
                          }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                            U{i}
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(module);
                        }}
                        className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        View Details <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
          <p className="text-zinc-500 mt-1">Manage your courses and academic workload.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Module
        </button>
      </div>

      {renderModuleGrid(
        sem1Modules, 
        "Semester 1", 
        getSemesterYearLabel('sem1')
      )}

      {renderModuleGrid(
        sem2Modules, 
        "Semester 2", 
        getSemesterYearLabel('sem2')
      )}

      <ModuleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingModule}
      />

      <ModuleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        module={selectedModule}
        deadlines={deadlines}
      />
    </div>
  );
}
