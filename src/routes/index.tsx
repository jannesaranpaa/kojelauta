import { CalendarWidget } from '#/components/Calendar';
import { DailyMessageWidget } from '#/components/DailyMessage';
import { ElectricityWidget } from '#/components/Electricity';
import { TransitWidget } from '#/components/Transit';
import { WeatherWidget } from '#/components/Weather';
import { useHslDepartures } from '#/features/transit/api';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
    const { data, isLoading, isError } = useHslDepartures();

    // The reduce function stays exactly the same
    const groupedStops = data?.reduce((acc, departure) => {
        if (!acc[departure.stopName]) {
            acc[departure.stopName] = [];
        }
        acc[departure.stopName].push(departure);
        return acc;
    }, {} as Record<string, typeof data>);

    return (
        <div className='grid grid-cols-2 gap-4 p-4'>
            <WeatherWidget />
            <ElectricityWidget margin={0.92} />

            {isLoading && (
                <>
                    <div className="animate-pulse bg-emerald-50 h-48 rounded-2xl"></div>
                    <div className="animate-pulse bg-emerald-50 h-48 rounded-2xl"></div>
                    <div className="animate-pulse bg-emerald-50 h-48 rounded-2xl"></div>
                    <div className="animate-pulse bg-emerald-50 h-48 rounded-2xl"></div>
                </>
            )}

            {/* Handle Error State */}
            {isError && (
                <div className="col-span-2 text-red-500 p-6 rounded-2xl bg-red-50">
                    Failed to load HSL data
                </div>
            )}

            {Object.entries(groupedStops || {}).map(([stopName, departures]) => (
                <TransitWidget
                    key={stopName}
                    stopName={stopName}
                    departures={departures}
                />
            ))}

            <CalendarWidget />

            <DailyMessageWidget />
        </div>
    );
}
