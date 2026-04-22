import { useElectricityPrices } from '../features/electricity/api';
import { DashboardChart } from './Chart';
import { Zap } from 'lucide-react';

interface ElectricityWidgetProps {
    margin?: number;
}

export function ElectricityWidget({ margin = 0 }: ElectricityWidgetProps) {
    const { data, isLoading, isError } = useElectricityPrices();

    if (isLoading) return <div className="animate-pulse bg-amber-100 h-64 rounded-2xl"></div>;
    if (isError) return <div className="text-red-500 p-6 rounded-2xl bg-red-50">Failed to load prices</div>;

    const VAT_MULTIPLIER = 1.255;

    const allPrices = data?.map(entry => {
        const date = new Date(entry.timestamp * 1000);
        const priceWithVatAndMargin = ((entry.price / 10) * VAT_MULTIPLIER) + margin;

        return {
            dateObj: date,
            price: priceWithVatAndMargin,
        };
    }) || [];

    const currentDay = new Date().getDate();
    const todayPrices = allPrices.filter(entry => entry.dateObj.getDate() === currentDay);

    const hourlyChartData = [];
    for (let h = 0; h < 24; h++) {
        const hourChunks = todayPrices.filter(entry => entry.dateObj.getHours() === h);

        if (hourChunks.length > 0) {
            const sum = hourChunks.reduce((total, item) => total + item.price, 0);
            const hourlyAvg = sum / hourChunks.length;

            hourlyChartData.push({
                time: `${h.toString().padStart(2, '0')}:00`,
                price: Number(hourlyAvg.toFixed(1)),
            });
        }
    }

    const todayHigh = todayPrices.length ? Math.max(...todayPrices.map(d => d.price)).toFixed(1) : 0;
    const todayLow = todayPrices.length ? Math.min(...todayPrices.map(d => d.price)).toFixed(1) : 0;

    const currentHour = new Date().getHours();
    const currentEntry = hourlyChartData.find(d => parseInt(d.time) === currentHour);
    const currentPrice = currentEntry?.price || 0;

    return (
        <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 shadow-sm border border-amber-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Nordpool</h2>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-800">{currentPrice}</span>
                        <span className="text-sm font-bold text-amber-700/70">c/kWh</span>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs font-medium text-slate-500">
                        <span>H: {todayHigh}</span>
                        <span>L: {todayLow}</span>
                        {margin > 0 && <span className="text-amber-600/70 ml-2">(+{margin}c)</span>}
                    </div>
                </div>

                <div className="text-amber-500 bg-amber-100/50 p-3 rounded-full">
                    <Zap className="w-8 h-8" />
                </div>
            </div>

            <div className="flex-1 min-h-[100px] mt-auto">
                <h3 className="text-xs font-semibold text-amber-800/70 uppercase tracking-wider mb-2">
                    Hourly Average Today
                </h3>
                <div className='h-30'>
                    <DashboardChart
                        data={hourlyChartData}
                        xKey="time"
                        yKey="price"
                        yUnit="c"
                        getBarColor={(entry) => {
                            if (entry.price >= 15) return "fill-rose-400";
                            if (entry.price >= 8) return "fill-amber-400";
                            return "fill-emerald-400";
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
