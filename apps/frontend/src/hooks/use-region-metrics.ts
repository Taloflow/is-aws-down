import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { visibleSectionAtom } from "~/components/RegionPageObserver";
import { transformData } from "./use-region-metrics/transform";
import { RegionMetrics } from "./use-region-metrics/types";

const BASE_URL = 'https://gcp-dashboard.b-cdn.net'

export const fetchRegionMetrics = async (regionURL: string) => {
    const response = await fetch(`${BASE_URL}/metrics?region=${regionURL}&groupby=minute`)
    const data = await response.json()
    return data as RegionMetrics
}

export const useRegionMetrics = (regionURL: string, section?: string) => {
    const visibleSection = useAtomValue(visibleSectionAtom)
    return useQuery({
        queryKey: ['regions', regionURL, 'metrics'],
        queryFn: async () => {
            const metrics = await fetchRegionMetrics(regionURL)
            return transformData(metrics)
        },
        staleTime: 5000,
        refetchInterval: typeof section === 'string' && (visibleSection === section) ? 5000 : false
    })
}