import { useQuery } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';

// 1. Updated GraphQL Query for v2
const HSL_QUERY = `
  query GetDepartures {
    vallila: stops(name: "Vallilan varikko") { ...StopData }
    haukilahti: stops(name: "Haukilahdenkatu") { ...StopData }
  }

  fragment StopData on Stop {
    name
    code
    stoptimesWithoutPatterns(numberOfDepartures: 15) {
      serviceDay
      realtimeDeparture
      realtime
      headsign
      trip {
        route {
          shortName
        }
      }
    }
  }
`;

export interface TransitDeparture {
    stopCode: string;
    stopName: string;
    route: string;
    headsign: string;
    minutesAway: number;
    isRealtime: boolean;
}

// 2. THIS RUNS ON THE SERVER
export const fetchHslDeparturesServer = createServerFn({ method: 'GET' })
    .handler(async (): Promise<TransitDeparture[]> => {
        const apiKey = process.env.HSL_API_KEY;
        if (!apiKey) throw new Error("HSL_API_KEY is missing in .env");

        const response = await fetch('https://api.digitransit.fi/routing/v2/hsl/gtfs/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'digitransit-subscription-key': apiKey,
            },
            body: JSON.stringify({ query: HSL_QUERY }),
        });

        if (!response.ok) throw new Error('Failed to fetch HSL data');

        const { data } = await response.json();

        // 3. Combine the arrays of stops into one flat list
        const stops = [
            ...(data.vallila || []),
            ...(data.haukilahti || [])
        ];

        // Your exact filtering logic remains!
        const allowedRoutes: Record<string, string[]> = {
            "H0320": ["6", "8"],
            "H0319": ["6", "8"],
            "H0854": ["13"],
            "H0855": ["13"]
        };

        const departures: TransitDeparture[] = [];
        const now = Date.now();

        stops.forEach((stop: any) => {
            const stopCode = stop.code;
            const routesWeWant = allowedRoutes[stopCode] || [];

            // If it's a bus stop with the same name, routesWeWant is empty and we skip it!
            if (routesWeWant.length === 0) return;

            stop.stoptimesWithoutPatterns.forEach((stoptime: any) => {
                // Note the updated path for the v2 schema: trip.route.shortName
                const route = stoptime.trip?.route?.shortName;

                if (!route || !routesWeWant.includes(route)) return;

                const departureTimestamp = (stoptime.serviceDay + stoptime.realtimeDeparture) * 1000;
                const minutesAway = Math.floor((departureTimestamp - now) / 60000);

                if (minutesAway < 0) return;

                departures.push({
                    stopCode,
                    stopName: stop.name,
                    route,
                    headsign: stoptime.headsign,
                    minutesAway,
                    isRealtime: stoptime.realtime,
                });
            });
        });

        return departures.sort((a, b) => a.minutesAway - b.minutesAway);
    });

// 3. THIS RUNS ON THE CLIENT
export const useHslDepartures = () => {
    return useQuery({
        queryKey: ['hsl', 'departures'],
        queryFn: () => fetchHslDeparturesServer(),
        refetchInterval: 1000 * 30,
    });
};
