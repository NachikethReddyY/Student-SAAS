import { useState } from 'react';
import { useSAS } from '../context';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { cn } from '../utils';
import EventModal from './EventModal';
import AssignmentModal from './AssignmentModal';
import { Event, Deadline } from '../types';

export default function CalendarView() {
  const { deadlines, modules, events, addEvent, updateEvent, deleteEvent, addDeadline, updateDeadline, deleteDeadline, accessToken, login } = useSAS();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | undefined>();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEditDeadline = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsAssignmentModalOpen(true);
  };

  const hasSyncIssue = (deadlines.some(d => !d.googleEventId) || events.some(e => !e.googleEventId)) && !!accessToken;
  const isUnauthorized = !accessToken;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-zinc-500 mt-1">Track your exams, quizzes, and academic events.</p>
        </div>
        <div className="flex items-center gap-4">
          {isUnauthorized ? (
            <button 
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              <RefreshCw size={16} />
              Enable Google Calendar
            </button>
          ) : hasSyncIssue ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
              <AlertCircle size={16} />
              Some items not synced
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
              <CheckCircle2 size={16} />
              Synced with Google
            </div>
          )}
          
          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
            <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 rounded-md transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-semibold min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 rounded-md transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={handleAddEvent}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayDeadlines = deadlines.filter(d => isSameDay(new Date(d.dueDate), day));
            const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={idx} 
                className={cn(
                  "min-h-[140px] p-2 border-r border-b border-zinc-100 last:border-r-0 relative group transition-colors",
                  !isCurrentMonth && "bg-zinc-50/50",
                  isCurrentMonth && "hover:bg-zinc-50/30"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-blue-600 text-white" : isCurrentMonth ? "text-zinc-900" : "text-zinc-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02] bg-zinc-100 text-zinc-700 border-l-2 border-zinc-400"
                    >
                      {event.startTime && <span className="mr-1 opacity-60 font-medium">{event.startTime}</span>}
                      {event.title}
                    </div>
                  ))}

                  {dayDeadlines.map(deadline => {
                    const module = modules.find(m => m.id === deadline.moduleId);
                    return (
                      <div 
                        key={deadline.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDeadline(deadline);
                        }}
                        className="px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: `${module?.color}15`, 
                          color: module?.color,
                          borderLeft: `2px solid ${module?.color}`
                        }}
                      >
                        {deadline.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={(data) => {
          if (selectedEvent) {
            updateEvent(selectedEvent.id, data);
          } else {
            addEvent(data);
          }
        }}
        initialData={selectedEvent}
        onDelete={deleteEvent}
      />

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={(data) => {
          if (selectedDeadline) {
            updateDeadline(selectedDeadline.id, data);
          } else {
            addDeadline(data);
          }
        }}
        modules={modules}
        initialData={selectedDeadline}
        onDelete={deleteDeadline}
      />
    </div>
  );
}
