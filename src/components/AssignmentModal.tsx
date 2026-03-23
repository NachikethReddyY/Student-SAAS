import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Deadline, Module, Priority, Status } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { ConfirmationModal } from './ConfirmationModal';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Deadline, 'id'>) => void;
  modules: Module[];
  initialData?: Deadline;
  onDelete?: (id: string) => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const STATUSES: Status[] = ['pending', 'in-progress', 'completed'];

export default function AssignmentModal({ isOpen, onClose, onSave, modules, initialData, onDelete }: AssignmentModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Omit<Deadline, 'id'>>({
    moduleId: modules[0]?.id || '',
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'assignment',
    status: 'pending',
    priority: 'medium',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        moduleId: initialData.moduleId,
        title: initialData.title,
        dueDate: initialData.dueDate,
        type: initialData.type,
        status: initialData.status,
        priority: initialData.priority,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        moduleId: modules[0]?.id || '',
        title: '',
        dueDate: new Date().toISOString().split('T')[0],
        type: 'assignment',
        status: 'pending',
        priority: 'medium',
        description: '',
      });
    }
  }, [initialData, isOpen, modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            <h2 className="text-xl font-bold">{initialData ? 'Edit Assignment' : 'Add New Assignment'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Assignment Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Final Project"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Module</label>
                <select
                  required
                  value={formData.moduleId}
                  onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700">Due Date</label>
                  <input
                    required
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700">Priority</label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('-', ' ').charAt(0).toUpperCase() + s.replace('-', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add some details..."
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100 flex gap-3 shrink-0">
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                {initialData ? 'Save Changes' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </motion.div>

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            if (initialData && onDelete) {
              onDelete(initialData.id);
              onClose();
            }
          }}
          title="Delete Assignment"
          message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone.`}
          confirmText="Delete Assignment"
          variant="danger"
        />
      </div>
    </AnimatePresence>
  );
}
