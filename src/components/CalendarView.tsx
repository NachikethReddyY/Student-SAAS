import { useState } from 'react';
import { useSAS } from '../context';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus
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

export default function CalendarView() {
  const { deadlines, modules } = useSAS();
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-zinc-500 mt-1">Track your exams, quizzes, and deadlines.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
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
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
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
                  {dayDeadlines.map(deadline => {
                    const module = modules.find(m => m.id === deadline.moduleId);
                    return (
                      <div 
                        key={deadline.id}
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
    </div>
  );
}
