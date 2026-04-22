import { useCalendarEvents } from '../features/calendar/api';
import { Calendar as CalendarIcon } from 'lucide-react';

export function CalendarWidget() {
    const { data: events, isLoading, isError } = useCalendarEvents();

    if (isLoading) return <div className="animate-pulse bg-indigo-50 h-64 rounded-2xl"></div>;
    if (isError) return <div className="text-red-500 p-6 rounded-2xl bg-red-50">Failed to load calendar</div>;

    const todayDate = new Date().toLocaleDateString('en-FI', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-indigo-100 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-indigo-50 pb-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-700 tracking-wide">
                        Family Agenda
                    </h2>
                    <p className="text-xs font-medium text-slate-400 mt-1 capitalize">
                        {todayDate}
                    </p>
                </div>
                <div className="text-indigo-500 bg-indigo-50 p-3 rounded-full">
                    <CalendarIcon className="w-6 h-6" />
                </div>
            </div>

            {/* Events List */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
                {!events || events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 mt-4">
                        <span className="text-2xl">🎉</span>
                        <p className="text-sm">No events today. Enjoy the free time!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="flex items-start gap-4">
                            {/* Time Column */}
                            <div className="min-w-[60px] flex flex-col items-end pt-0.5">
                                <span className={`text-sm font-bold ${event.isAllDay ? 'text-indigo-500' : 'text-slate-600'}`}>
                                    {event.startTime}
                                </span>
                            </div>

                            {/* Divider Line */}
                            <div className="w-0.5 bg-indigo-100 rounded-full h-full min-h-[30px] self-stretch relative">
                                <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></div>
                            </div>

                            {/* Event Title */}
                            <div className="flex-1 pb-2">
                                <p className="text-sm font-medium text-slate-700">
                                    {event.title}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
