import { useQuery } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start'

interface EleringResponse {
    success: boolean;
    data: {
        fi: { timestamp: number; price: number }[];
    };
}

// 1. THIS RUNS ON THE SERVER
// By using createServerFn, TanStack Start knows to execute this fetch
// from your backend (where CORS does not exist).
export const fetchElectricityPricesServer = createServerFn({ method: 'GET' })
    .handler(async () => {
        // Set Start Date to Yesterday (to safely cover all timezones)
        const start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);

        // Set End Date to Tomorrow (to catch tomorrow's prices when published)
        const end = new Date();
        end.setDate(end.getDate() + 2);
        end.setHours(23, 59, 59, 999);

        // Build the URL with the new date parameters
        const url = new URL('https://dashboard.elering.ee/api/nps/price');
        url.searchParams.append('start', start.toISOString()); // e.g., 2023-10-24T00:00:00.000Z
        url.searchParams.append('end', end.toISOString());

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error('Failed to fetch electricity prices on the server');
        }

        const json: EleringResponse = await response.json();

        // You should now see hundreds of data points in your terminal log!
        console.log(`Fetched ${json.data.fi.length} price points`);

        return json.data.fi;
    });

// 2. THIS RUNS ON THE CLIENT
export const useElectricityPrices = () => {
    return useQuery({
        queryKey: ['electricity', 'fi'],
        // Instead of calling fetch directly, we call our server function!
        queryFn: () => fetchElectricityPricesServer(),
        // Electricity prices update once a day (around 14:00 EET for tomorrow's prices),
        // so checking once an hour is perfect.
        refetchInterval: 1000 * 60 * 60,
    });
};
