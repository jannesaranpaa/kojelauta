import {
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    CloudDrizzle,
    HelpCircle
} from 'lucide-react';

export const getWeatherIcon = (code: number, className?: string) => {
    // 0: Clear sky
    if (code === 0) return <Sun className={className} />;

    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if (code === 1) return <CloudSun className={className} />;
    if (code === 2 || code === 3) return <Cloud className={className} />;

    // 45, 48: Fog and depositing rime fog
    if (code === 45 || code === 48) return <CloudFog className={className} />;

    // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // 56, 57: Freezing Drizzle: Light and dense intensity
    if ((code >= 51 && code <= 57)) return <CloudDrizzle className={className} />;

    // 61, 63, 65: Rain: Slight, moderate and heavy intensity
    // 66, 67: Freezing Rain: Light and heavy intensity
    // 80, 81, 82: Rain showers: Slight, moderate, and violent
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className={className} />;

    // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
    // 77: Snow grains
    // 85, 86: Snow showers slight and heavy
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <CloudSnow className={className} />;

    // 95: Thunderstorm: Slight or moderate
    // 96, 99: Thunderstorm with slight and heavy hail
    if (code >= 95 && code <= 99) return <CloudLightning className={className} />;

    // Fallback for unknown codes
    return <HelpCircle className={className} />;
};
