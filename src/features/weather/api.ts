import { useQuery } from '@tanstack/react-query';

// Update the interface to include the new hourly object
interface WeatherData {
    current: {
        temperature_2m: number;
        precipitation: number;
        weather_code: number;
    };
    hourly: {
        time: string[];
        precipitation: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

const fetchHelsinkiWeather = async (): Promise<WeatherData> => {
    // const lat = 60.1695;
    // const lon = 24.9354;

    const lat = 42.65601;
    const lon = 18.11396;

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lon.toString());
    url.searchParams.append('current', 'temperature_2m,precipitation,weather_code');
    // Add hourly precipitation request here:
    url.searchParams.append('hourly', 'precipitation');
    url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min');
    url.searchParams.append('timezone', 'Europe/Helsinki');
    url.searchParams.append('models', 'icon_seamless');

    // Optional but highly recommended: limit data to just 2 days to save bandwidth
    url.searchParams.append('forecast_days', '2');

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error('Network response was not ok fetching weather');
    }

    return response.json();
};

export const useHelsinkiWeather = () => {
    return useQuery({
        queryKey: ['weather', 'helsinki'],
        queryFn: fetchHelsinkiWeather,
        refetchInterval: 1000 * 60 * 15,
        staleTime: 1000 * 60 * 10,
    });
};
