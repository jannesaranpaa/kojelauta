import { Sparkles, Sun, Moon, Coffee } from 'lucide-react';

interface DailyMessageWidgetProps {
    customMessage?: string;
    author?: string;
}

export function DailyMessageWidget({ customMessage, author }: DailyMessageWidgetProps) {
    const hour = new Date().getHours();

    let greeting = "Good evening";
    let TimeIcon = Moon;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
        TimeIcon = Coffee;
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
        TimeIcon = Sun;
    }

    const fallbackMessage = "Don't forget to water the monstera plant today! Have a great Wednesday.";
    const fallbackAuthor = "Mom";

    const displayMessage = customMessage || fallbackMessage;
    const displayAuthor = author || fallbackAuthor;

    return (
        <div className="p-6 rounded-2xl bg-linear-to-br from-rose-50 to-pink-50 shadow-sm border border-rose-100 flex flex-col h-full relative overflow-hidden">

            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-rose-500/5 rotate-12" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-rose-800">
                    <TimeIcon className="w-5 h-5" />
                    <h2 className="text-sm font-bold tracking-wide uppercase">
                        {greeting}, Family!
                    </h2>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                <p className="text-lg font-medium text-slate-700 leading-relaxed italic">
                    "{displayMessage}"
                </p>

                <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-px bg-rose-300"></div>
                    <span className="text-sm font-bold text-rose-500 uppercase tracking-wider">
                        {displayAuthor}
                    </span>
                </div>
            </div>
        </div>
    );
}
