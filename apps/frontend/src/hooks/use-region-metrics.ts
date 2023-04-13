import { useQuery } from "@tanstack/react-query";
import { transformData } from "./use-region-metrics/transform";
import { RegionMetrics } from "./use-region-metrics/types";

const BASE_URL = 'https://gcp-dashboard.b-cdn.net'

export const fetchRegionStatus = async (regionURL: string) => {
    const response = await fetch(`${BASE_URL}/metrics?region=${regionURL}&groupby=minute`)
    const data = await response.json()
    return data as RegionMetrics
}

export const useRegionStatus = (regionURL: string) => useQuery({
    queryKey: [`regions`, regionURL],
    queryFn: async () => {
        const metrics = await fetchRegionStatus(regionURL)
        return transformData(metrics)
    }
})