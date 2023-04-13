import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/dist/query/react";

export type SummaryResponse = LocationSummary[];

export interface LocationSummary {
  region: string;
  "1h": ServicesAffected;
  "24h": ServicesAffected;
}

export interface ServicesAffected {
  up: number;
  down: number;
  services_affected: string[];
}

export const summaryAPI = createApi({
  reducerPath: "summaryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    getStats: builder.query<LocationSummary[], string>({
      query: () => `/overview`,
    }),
  }),
});

export const { useGetStatsQuery } = summaryAPI;
