import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, AlignLeft } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmationModal } from './ConfirmationModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  initialData?: Event;
  onDelete?: (id: string) => void;
}

export default function EventModal({ isOpen, onClose, onSave, initialData, onDelete }: EventModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        location: initialData.location || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        location: '',
        description: '',
      });
    }
  }, [initialData, isOpen]);

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
            <h2 className="text-xl font-bold">{initialData ? 'Edit Event' : 'Add New Event'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Event Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Study Session"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 flex items-center gap-2">
                  <CalendarIcon size={14} /> Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 flex items-center gap-2">
                    <Clock size={14} /> Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 flex items-center gap-2">
                    <Clock size={14} /> End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 flex items-center gap-2">
                  <MapPin size={14} /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Library, Room 204"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 flex items-center gap-2">
                  <AlignLeft size={14} /> Description
                </label>
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
                {initialData ? 'Save Changes' : 'Create Event'}
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
          title="Delete Event"
          message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone.`}
          confirmText="Delete Event"
          variant="danger"
        />
      </div>
    </AnimatePresence>
  );
}
