import type { TransitDeparture } from '../features/transit/api';
import { TramFront } from 'lucide-react';

interface TransitWidgetProps {
    stopName: string;
    departures: TransitDeparture[];
}

export function TransitWidget({ stopName, departures }: TransitWidgetProps) {
    // Only show the next 4 departures so the widget doesn't get too tall
    const displayDepartures = departures.slice(0, 4);

    return (
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-emerald-100 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-emerald-50 pb-3">
                <div className="text-emerald-600 bg-emerald-50 p-2 rounded-xl">
                    <TramFront className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-slate-700 tracking-wide">
                    {stopName}
                </h2>
            </div>

            {/* Departures List */}
            <div className="flex flex-col gap-3 flex-1">
                {displayDepartures.length === 0 ? (
                    <div className="text-sm text-slate-400 mt-2">No upcoming departures</div>
                ) : (
                    displayDepartures.map((dep, index) => (
                        <div key={`${dep.route}-${dep.minutesAway}-${index}`} className="flex items-center justify-between">

                            {/* Route & Destination */}
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="bg-[#00985F] text-white text-xs font-black px-2 py-1 rounded-md min-w-[28px] text-center">
                                    {dep.route}
                                </span>
                                <span className="text-sm font-medium text-slate-600 truncate">
                                    {dep.headsign}
                                </span>
                            </div>

                            {/* Time & Realtime Indicator */}
                            <div className="flex items-center gap-2 pl-3">
                                {dep.isRealtime && (
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                )}
                                <span className={`text-sm font-bold ${dep.minutesAway <= 3 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                    {dep.minutesAway === 0 ? 'Now' : `${dep.minutesAway} min`}
                                </span>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
