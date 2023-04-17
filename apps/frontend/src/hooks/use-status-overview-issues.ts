import { useMemo } from "react";
import { LocationSummary } from "./use-aws-status-overview";

export const useStatusOverviewIssues = (data: LocationSummary[]) => useMemo(() => {
    const downRegions = new Set<string>()
    const lastDay = new Set<string>()
    const lastHour = new Set(data.filter(datum => datum["1h"].down > 0).flatMap(datum => datum["1h"].services_affected))
    data.forEach(datum => {
        if (datum['24h'].down > 0) {
            datum['24h'].services_affected.map(affectedService => lastDay.add(affectedService))
            downRegions.add(datum.region)
        }
    })
    return {
        downRegions,
        lastHour, 
        lastDay,
    } as const
}, [data])