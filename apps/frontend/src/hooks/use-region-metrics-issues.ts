import { useMemo } from "react";
import type { RegionChartMetric } from "./use-region-metrics/transform";

export const useRegionMetricsIssues = (data: RegionChartMetric[]) => {
    /*let hadIssuesInLastHour = [] as string[];
    let hadIssuesInLastDay = [] as string[];
    data.map((downChecks) => {
      if (downChecks.label === "All") {
        return;
      }
      downChecks.data.map((datum, index) => {
        // Check if the index of the error was in the last 60 checks
        if (index > downChecks.data.length - 60 && datum === -1) {
          hadIssuesInLastHour.push(downChecks.label);
        }
        if (datum === -1) {
          hadIssuesInLastDay.push(downChecks.label);
        }
      });
    });
    hadIssuesInLastHour = [...new Set(hadIssuesInLastHour)];
    hadIssuesInLastDay = [...new Set(hadIssuesInLastDay)];

    if (hadIssuesInLastHour.length > 0 || hadIssuesInLastDay.length > 0) {
      setPageState({
        PageTitle: `AWS services in ${props.RegionName.toUpperCase()} have had issues in the last ${
          hadIssuesInLastHour.length > 0 ? "hour" : "day"
        }`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-fire.gif",
        HadIssuesInLastHour: hadIssuesInLastHour,
        HadIssuesInLastDay: hadIssuesInLastDay,
      });
    } else {
      setPageState({
        PageTitle: `AWS ${props.RegionName.toUpperCase()} is up!`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-scroll-up.gif",
        HadIssuesInLastHour: hadIssuesInLastHour,
        HadIssuesInLastDay: hadIssuesInLastDay,
      });
    } */

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