import { useHelsinkiWeather } from '../features/weather/api';
import { getWeatherIcon } from '../features/weather/utils';
import { DashboardChart } from './Chart';

export function WeatherWidget() {
    const { data, isLoading, isError } = useHelsinkiWeather();

    if (isLoading) return <div className="animate-pulse bg-sky-100 h-64 rounded-2xl"></div>;
    if (isError) return <div className="text-red-500 p-6 rounded-2xl bg-red-50">Failed to load weather</div>;

    const currentTemp = data?.current.temperature_2m;
    const weatherCode = data?.current.weather_code ?? -1;
    const todayHigh = data?.daily.temperature_2m_max[0];
    const todayLow = data?.daily.temperature_2m_min[0];

    const hourlyPrecipData = [];
    if (data) {
        for (let i = 0; i < 24; i += 2) {
            const sumPrecip = data.hourly.precipitation[i] + data.hourly.precipitation[i + 1];

            const date = new Date(data.hourly.time[i]);
            const hourLabel = date.toLocaleTimeString('en-FI', { hour: '2-digit', minute: '2-digit' });

            hourlyPrecipData.push({
                time: hourLabel,
                amount: Number(sumPrecip.toFixed(1)),
                rawHour: date.getHours(),
            });
        }
    }

    return (
        <div className="p-6 rounded-2xl bg-linear-to-br from-sky-50 to-blue-50 shadow-sm border border-sky-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-sm font-semibold text-sky-800 uppercase tracking-wider">Helsinki</h2>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-800">{currentTemp}°</span>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs font-medium text-slate-500">
                        <span>H: {todayHigh}°</span>
                        <span>L: {todayLow}°</span>
                    </div>
                </div>

                <div className="text-sky-500">
                    {getWeatherIcon(weatherCode, "w-12 h-12")}
                </div>
            </div>

            <div className="flex-1 min-h-[100px] mt-auto">
                <h3 className="text-xs font-semibold text-sky-800/70 uppercase tracking-wider mb-2">
                    Precipitation
                </h3>
                <div className='h-30'>
                    <DashboardChart
                        data={hourlyPrecipData}
                        xKey="time"
                        yKey="amount"
                        yUnit="mm"
                        getBarColor={(entry) =>
                            entry.amount > 0 ? "fill-sky-500" : "fill-mist-300"
                        }
                    />
                </div>
            </div>
        </div>
    );
}
