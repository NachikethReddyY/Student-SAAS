import { useState } from 'react';
import { useSAS } from '../context';
import { 
  ClipboardList, 
  Filter, 
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { formatDate, cn } from '../utils';
import AssignmentModal from './AssignmentModal';
import AssignmentDetailModal from './AssignmentDetailModal';
import { ConfirmationModal } from './ConfirmationModal';
import { Deadline } from '../types';

export default function AssignmentsView() {
  const { deadlines, modules, updateDeadlineStatus, addDeadline, updateDeadline, deleteDeadline } = useSAS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Deadline | undefined>(undefined);
  const [selectedAssignment, setSelectedAssignment] = useState<Deadline | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  const statusPriority = {
    'pending': 0,
    'in-progress': 1,
    'completed': 2
  };

  const assignments = [...deadlines.filter(d => d.type === 'assignment')].sort((a, b) => {
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleSave = (data: Omit<Deadline, 'id'>) => {
    if (editingAssignment) {
      updateDeadline(editingAssignment.id, data);
    } else {
      addDeadline(data);
    }
  };

  const handleEdit = (assignment: Deadline) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    setAssignmentToDelete(id);
    setActiveMenu(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-zinc-500 mt-1">Track your coursework and project progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button 
            onClick={() => {
              setEditingAssignment(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ClipboardList size={18} />
            New Assignment
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Assignment</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Module</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Priority</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {assignments.map((assignment) => {
              const module = modules.find(m => m.id === assignment.moduleId);
              const isPastDue = assignment.status !== 'completed' && new Date(assignment.dueDate) < new Date();
              
              return (
                <tr key={assignment.id} className={cn("hover:bg-zinc-50 transition-colors group relative", activeMenu === assignment.id && "z-50")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateDeadlineStatus(assignment.id, assignment.status === 'completed' ? 'pending' : 'completed')}
                        className="text-zinc-300 hover:text-blue-600 transition-colors"
                      >
                        {assignment.status === 'completed' ? (
                          <CheckCircle2 size={20} className="text-blue-600" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsDetailModalOpen(true);
                        }}
                        className={cn(
                          "font-medium hover:text-blue-600 transition-colors flex items-center gap-2 group/title",
                          assignment.status === 'completed' && "text-zinc-400 line-through"
                        )}
                      >
                        {assignment.title}
                        <ExternalLink size={12} className="opacity-0 group-hover/title:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: module?.color }} />
                      <span className="text-sm text-zinc-600">{module?.code}</span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-sm",
                    isPastDue ? "text-red-600 font-bold" : "text-zinc-600"
                  )}>
                    {formatDate(assignment.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      assignment.priority === 'high' ? "bg-red-50 text-red-600" :
                      assignment.priority === 'medium' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {assignment.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-md",
                      isPastDue ? "bg-red-100 text-red-700 border border-red-200" :
                      assignment.status === 'completed' ? "bg-green-50 text-green-700" :
                      assignment.status === 'in-progress' ? "bg-blue-50 text-blue-700" :
                      "bg-zinc-100 text-zinc-600"
                    )}>
                      {isPastDue ? 'PAST DUE' : assignment.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className={cn("px-6 py-4 text-right relative", activeMenu === assignment.id && "z-50")}>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === assignment.id ? null : assignment.id)}
                      className="p-1 hover:bg-zinc-200 rounded-md transition-colors text-zinc-400 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {activeMenu === assignment.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveMenu(null)}
                        />
                                <div className="absolute right-6 top-12 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-[1000] py-1 overflow-hidden">
                                  <button 
                                    onClick={() => {
                                      updateDeadlineStatus(assignment.id, assignment.status === 'completed' ? 'pending' : 'completed');
                                      setActiveMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                                  >
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    {assignment.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
                                  </button>
                                  <button 
                                    onClick={() => handleEdit(assignment)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                                  >
                                    <Edit2 size={14} />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(assignment.id)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {assignments.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            No assignments tracked yet.
          </div>
        )}
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
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
        isOpen={!!assignmentToDelete}
        onClose={() => setAssignmentToDelete(null)}
        onConfirm={() => {
          if (assignmentToDelete) {
            deleteDeadline(assignmentToDelete);
            setAssignmentToDelete(null);
          }
        }}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmText="Delete Assignment"
        variant="danger"
      />
    </div>
  );
}
