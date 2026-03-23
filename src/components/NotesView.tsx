import React, { useState } from 'react';
import { useSAS } from '../context';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Eye,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import Markdown from 'react-markdown';
import { ConfirmationModal } from './ConfirmationModal';
import { Note } from '../types';

export default function NotesView() {
  const { notes, modules, addNote, updateNote, deleteNote } = useSAS();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Modal State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moduleId, setModuleId] = useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setModuleId(note.moduleId || '');
      setViewMode('preview');
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setModuleId('');
      setViewMode('edit');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const noteData = {
      title,
      content,
      moduleId: moduleId || undefined
    };

    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
    setActiveMenu(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Study Notes</h1>
          <p className="text-zinc-500 font-medium">Capture ideas and module summaries in Markdown</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-200 transition-all"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => {
          const module = modules.find(m => m.id === note.moduleId);
          return (
            <motion.div
              layout
              key={note.id}
              className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-64"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {module && (
                    <span 
                      className="text-[10px] font-bold uppercase tracking-widest mb-1 block"
                      style={{ color: module.color }}
                    >
                      {module.code}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleOpenModal(note)}>
                    {note.title}
                  </h3>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === note.id ? null : note.id)}
                    className="p-1 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenu === note.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 top-8 w-32 bg-white border border-zinc-200 rounded-xl shadow-lg z-[1000] py-1 overflow-hidden">
                        <button 
                          onClick={() => {
                            handleOpenModal(note);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(note.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-zinc-500 line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => handleOpenModal(note)}
                  className="text-xs font-bold text-zinc-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Read More <Layout size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-full sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="text-xl font-bold text-zinc-900 focus:outline-none flex-1 bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-100 p-1 rounded-xl mr-4">
                    <button
                      onClick={() => setViewMode('edit')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                        viewMode === 'edit' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                      )}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setViewMode('preview')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                        viewMode === 'preview' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                      )}
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Editor/Preview Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                  {viewMode === 'edit' ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your note in Markdown..."
                      className="w-full h-full min-h-[500px] focus:outline-none resize-none font-mono text-sm leading-relaxed text-zinc-700"
                    />
                  ) : (
                    <div className="markdown-body max-w-none">
                      <Markdown>{content || '*No content yet.*'}</Markdown>
                    </div>
                  )}
                </div>

                {/* Sidebar Settings */}
                <div className="w-full lg:w-72 bg-zinc-50 border-l border-zinc-100 p-6 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Module</h4>
                    <select
                      value={moduleId}
                      onChange={(e) => setModuleId(e.target.value)}
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    >
                      <option value="">General Note</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-8 border-t border-zinc-200">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Markdown Guide</h5>
                      <ul className="text-[10px] text-blue-800/70 space-y-1 font-medium">
                        <li># Header 1</li>
                        <li>## Header 2</li>
                        <li>**Bold Text**</li>
                        <li>*Italic Text*</li>
                        <li>- Bullet points</li>
                        <li>1. Numbered list</li>
                        <li>[Link](url)</li>
                      </ul>
                    </div>
                  </div>

                  {editingNote && (
                    <div className="pt-8 border-t border-zinc-200">
                      <button
                        onClick={() => {
                          handleDelete(editingNote.id);
                          setIsModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
                      >
                        <Trash2 size={16} />
                        Delete Note
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          if (noteToDelete) {
            deleteNote(noteToDelete);
            setNoteToDelete(null);
            setIsModalOpen(false);
          }
        }}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete Note"
        variant="danger"
      />
    </div>
  );
}
