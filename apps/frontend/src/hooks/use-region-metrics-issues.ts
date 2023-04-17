import { useMemo } from "react";
import type { RegionChartMetric } from "./use-region-metrics/transform";

export const useRegionMetricsIssues = (data: RegionChartMetric[]) => {
    return useMemo(() => {
        const lastHour = new Set<string>()
        const lastDay = new Set<string>()
        data.forEach(metric => {
            if (metric.label === 'all') {
                return undefined
            }
            const checkLength = metric.data.length
            const last60Checks = checkLength - 60
            metric.data.forEach((datum, index) => {
                const inLast60Checks = index > last60Checks && datum === -1
                if (inLast60Checks) {
                    lastHour.add(metric.label)
                    return undefined
                }
                if (datum === -1) {
                    lastDay.add(metric.label)
                    return undefined
                }
            })
        })
        /*
            these were sorted before, unsure if its necessary.
            hadIssuesInLastHour.sort();
            hadIssuesInLastDay.sort();
        */
        return { lastHour, lastDay } as const
    }, [data])
}