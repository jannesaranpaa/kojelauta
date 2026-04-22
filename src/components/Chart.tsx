import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DashboardChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    formatXTick?: (value: any) => string;
    formatYTick?: (value: any) => string;
    yUnit?: string;
    getBarColor?: (entry: any) => string;
    maxXTicks?: number;
}

export function DashboardChart({
    data,
    xKey,
    yKey,
    formatXTick = (val) => String(val),
    formatYTick = (val) => String(val),
    yUnit = "",
    getBarColor = () => "fill-sky-700/80",
    maxXTicks = 6,
}: DashboardChartProps) {

    const xInterval = data.length > maxXTicks
        ? Math.ceil(data.length / maxXTicks) - 1
        : 0;

    return (
        <div className="rounded-xl h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 5, left: 5, bottom: 0 }}
                >
                    <XAxis
                        dataKey={xKey}
                        axisLine={{ className: "stroke-mist-400/50" }}
                        tickLine={false}
                        tick={{ fontSize: 10, className: "fill-mist-500" }}
                        dy={5}
                        tickFormatter={formatXTick}
                        interval={xInterval}
                    />

                    <YAxis
                        dataKey={yKey}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, className: "fill-mist-500" }}
                        tickCount={3}
                        dx={-5}
                        width={30}
                        tickFormatter={(val, i) => i === 0 ? `${formatYTick(val)}${yUnit ? ` ${yUnit}` : ''}` : formatYTick(val)}
                    />

                    <Bar
                        dataKey={yKey}
                        shape={(props: any) => {
                            const colorClass = getBarColor(props.payload);
                            return (
                                <Rectangle
                                    {...props}
                                    className={`${colorClass} stroke-none`}
                                    radius={[4, 4, 0, 0]}
                                />
                            );
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
